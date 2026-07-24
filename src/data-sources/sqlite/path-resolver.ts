// path-resolver.ts — translates InterMine dotted paths + constraints into SQL,
// driven by the model. SQLite analogue of interminePathQuery/intermineConstraint.
// Supports: reference/o2m/m2m joins (dedup by path prefix), LOOKUP (classkeys +
// synonym), InterMine constraintLogic (codes + AND/OR/parens), and multi-path sort.
import {Model} from './model.js';
import {
  tableOf,
  attrCol,
  refCol,
  PK,
  INDIRECTION,
  ABSENT_COLLECTIONS,
  deriveIndirection,
  SYNONYM_TABLE,
  SYNONYM_VALUE_COL,
  SYNONYM_SUBJECT_COL,
} from './physical-names.js';
import {ClassKeyMap} from './class-keys.js';

export type SqlOp =
  | '='
  | '!='
  | '<'
  | '<='
  | '>'
  | '>='
  | 'CONTAINS'
  | 'IS NULL'
  | 'IS NOT NULL'
  | 'ONE OF'
  | 'NONE OF'
  | 'LOOKUP';

export interface Constraint {
  path: string;
  op: SqlOp;
  value?: string | number;
  values?: Array<string | number>;
  code?: string; // referenced by constraintLogic (e.g. 'A')
}

export interface BuiltQuery {
  sql: string;
  params: Array<string | number>;
  columns: string[];
  warnings: string[];
}

interface JoinReg {
  order: string[];
  alias: Map<string, string>;
  sql: Map<string, string>;
}
interface State {
  joins: JoinReg;
  counter: {n: number};
  warnings: string[];
}
interface Resolved {
  alias: string;
  column: string;
  cls: string;
  attrType?: string; // model type of the terminal attribute, for value coercion
  expr?: string; // full SQL expression to use instead of `alias.column` (e.g. class)
}

// InterMine's jsonobjects return the SIMPLE class name ("Gene"); the physical
// `class` column stores the fully-qualified name ("org.intermine.model.bio.Gene").
// Strip the package so the SQLite output matches. All classes in the bio model
// share this prefix (verified against the mirror).
const classExpr = (alias: string): string =>
  `replace(${alias}.class, 'org.intermine.model.bio.', '')`;

// InterMine stringifies every constraint value, and pg2sqlite stores each column
// with its Postgres type (String attrs as TEXT, numeric attrs as INTEGER/REAL).
// SQLite won't equate an integer bind param with a TEXT '3847', so a caller passing
// a number for a String attr (getOrganism(taxonId: number)) would silently miss.
// Coerce the value to the attribute's model type so the bound param matches storage.
function coerceValue(
  value: string | number,
  attrType?: string,
): string | number {
  if (attrType == null || value == null) return value;
  if (attrType.endsWith('String') || attrType.endsWith('Date'))
    return String(value);
  if (/(Integer|Long|Short|int)$/.test(attrType)) {
    const n = typeof value === 'number' ? value : parseInt(String(value), 10);
    return Number.isFinite(n) ? n : value;
  }
  if (/(Double|Float)$/.test(attrType)) {
    const n = Number(value);
    return Number.isFinite(n) ? n : value;
  }
  return value;
}

export class QueryBuilder {
  constructor(
    private model: Model,
    private classKeys: ClassKeyMap = {},
  ) {}

  private state(root: string): State {
    const joins: JoinReg = {
      order: [],
      alias: new Map(),
      sql: new Map(),
    };
    joins.alias.set(root, 't0');
    return {joins, counter: {n: 0}, warnings: []};
  }

  // Walk a path; register (and dedup) joins; return terminal {alias, column, cls}.
  // For object endpoints (ref/collection) column is the PK and cls is that object's class.
  private resolve(root: string, path: string, st: State): Resolved | null {
    const segs = path.split('.');
    if (segs[0] !== root) {
      st.warnings.push(`path "${path}" does not start with root "${root}"`);
      return null;
    }
    let cur = root,
      prefix = root,
      alias = st.joins.alias.get(prefix)!;
    for (let i = 1; i < segs.length; i++) {
      const seg = segs[i];
      const last = i === segs.length - 1;
      // InterMine pseudo-attributes used by the jsonobjects "object" views:
      //   objectId — the row's id (same as the PK)
      //   class    — the concrete-class discriminator column
      // Neither is a model field, so resolve them directly on the current alias.
      if (last && (seg === 'objectId' || seg === 'id')) {
        return {alias, column: PK, cls: cur};
      }
      if (last && seg === 'class') {
        return {alias, column: 'class', cls: cur, expr: classExpr(alias)};
      }
      const f = this.model.field(cur, seg);
      if (!f) {
        st.warnings.push(`unknown field ${cur}.${seg} (in "${path}")`);
        return null;
      }
      if (f.kind === 'attr') {
        if (!last) {
          st.warnings.push(`cannot traverse through attribute ${cur}.${seg}`);
          return null;
        }
        return {alias, column: attrCol(seg), cls: cur, attrType: f.def.type};
      }
      const nextPrefix = `${prefix}.${seg}`;
      if (!st.joins.alias.has(nextPrefix)) {
        const nextAlias = `t${++st.counter.n}`;
        if (f.kind === 'ref') {
          const R = f.def.referencedType;
          // optimization: `X.ref.id` (or `.objectId`) equals the FK column
          // `X.refid` already on the source row — no join, and the referenced
          // table need not be present. Only when id/objectId is the terminal.
          if (
            i + 1 === segs.length - 1 &&
            (segs[i + 1] === 'id' || segs[i + 1] === 'objectId')
          ) {
            return {alias, column: refCol(seg), cls: R};
          }
          st.joins.alias.set(nextPrefix, nextAlias);
          st.joins.sql.set(
            nextPrefix,
            `LEFT JOIN ${tableOf(R)} ${nextAlias} ON ${nextAlias}.${PK} = ${alias}.${refCol(seg)}`,
          );
          st.joins.order.push(nextPrefix);
        } else {
          const ck = this.model.collectionKind(f.def);
          const R = ck.referencedType;
          if (ck.kind === 'o2m') {
            st.joins.alias.set(nextPrefix, nextAlias);
            st.joins.sql.set(
              nextPrefix,
              `LEFT JOIN ${tableOf(R)} ${nextAlias} ON ${nextAlias}.${refCol(ck.reverseReference)} = ${alias}.${PK}`,
            );
            st.joins.order.push(nextPrefix);
          } else {
            const key = `${cur}.${seg}`;
            const declaring = this.model.declaringClass(cur, seg);
            // Absence can be declared on the leaf or on the class that defines the
            // (inherited) collection — SequenceFeature.overlappingFeatures covers
            // Gene.overlappingFeatures and every other subclass too.
            if (
              ABSENT_COLLECTIONS.has(key) ||
              ABSENT_COLLECTIONS.has(`${declaring}.${seg}`)
            ) {
              st.warnings.push(
                `collection ${key} is not materialized in this mine (returns empty)`,
              );
              return null;
            }
            // nearCol name is the reverse-reference collection, or (unidirectional)
            // the class that declares the collection. An explicit INDIRECTION entry
            // overrides the derivation.
            const nearName = f.def.reverseReference ?? declaring;
            const spec = INDIRECTION[key] ?? deriveIndirection(seg, nearName);
            const ix = `x${st.counter.n}`;
            st.joins.alias.set(nextPrefix, nextAlias);
            st.joins.sql.set(
              nextPrefix,
              `LEFT JOIN ${spec.table} ${ix} ON ${ix}.${spec.nearCol} = ${alias}.${PK} ` +
                `LEFT JOIN ${tableOf(R)} ${nextAlias} ON ${nextAlias}.${PK} = ${ix}.${spec.farCol}`,
            );
            st.joins.order.push(nextPrefix);
          }
        }
      }
      alias = st.joins.alias.get(nextPrefix)!;
      cur = f.def.referencedType;
      prefix = nextPrefix;
      if (last) return {alias, column: PK, cls: cur};
    }
    return {alias, column: PK, cls: cur};
  }

  // InterMine LOOKUP: exact (case-insensitive) match on class-key attributes OR a
  // synonym whose value matches. `r.cls` is the class of the looked-up object.
  private lookupPredicate(
    r: Resolved,
    value: string | number,
    params: Array<string | number>,
  ): string {
    const keys = this.classKeys[r.cls] ?? [];
    const parts: string[] = [];
    for (const k of keys) {
      params.push(value);
      parts.push(`${r.alias}.${attrCol(k)} = ? COLLATE NOCASE`);
    }
    params.push(value);
    parts.push(
      `EXISTS (SELECT 1 FROM ${SYNONYM_TABLE} s WHERE s.${SYNONYM_SUBJECT_COL} = ${r.alias}.${PK} ` +
        `AND s.${SYNONYM_VALUE_COL} = ? COLLATE NOCASE)`,
    );
    return parts.length ? `(${parts.join(' OR ')})` : '1=0';
  }

  private predicate(
    c: Constraint,
    r: Resolved,
    params: Array<string | number>,
  ): string {
    if (c.op === 'LOOKUP')
      return this.lookupPredicate(r, c.value ?? '', params);
    const col = r.expr ?? `${r.alias}.${r.column}`;
    switch (c.op) {
      case 'IS NULL':
        return `${col} IS NULL`;
      case 'IS NOT NULL':
        return `${col} IS NOT NULL`;
      case 'CONTAINS':
        // LIKE is inherently textual; coerce to string form.
        params.push(`%${String(c.value)}%`);
        return `${col} LIKE ?`;
      case 'ONE OF':
      case 'NONE OF': {
        const vals = c.values ?? [];
        vals.forEach((v) => params.push(coerceValue(v, r.attrType)));
        return `${col} ${c.op === 'ONE OF' ? 'IN' : 'NOT IN'} (${vals.map(() => '?').join(', ')})`;
      }
      default:
        params.push(coerceValue(c.value as string | number, r.attrType));
        return `${col} ${c.op} ?`;
    }
  }

  private orderBy(root: string, sort: string | undefined, st: State): string {
    if (!sort) return '';
    const toks = sort.trim().split(/\s+/);
    const parts: string[] = [];
    for (let i = 0; i < toks.length; ) {
      const path = toks[i++];
      let dir = '';
      if (i < toks.length && /^(ASC|DESC)$/i.test(toks[i]))
        dir = ' ' + toks[i++].toUpperCase();
      const r = this.resolve(root, path, st);
      if (r) parts.push(`${r.expr ?? `${r.alias}.${r.column}`}${dir}`);
    }
    return parts.length ? `\nORDER BY ${parts.join(', ')}` : '';
  }

  // Assemble WHERE honoring InterMine constraintLogic ("A AND (B OR C)").
  // Params are collected in the ORDER codes appear in the logic, so `?`
  // placeholders line up. Without logic, all constraints are AND-ed.
  private where(
    root: string,
    constraints: Constraint[],
    logic: string | undefined,
    st: State,
    params: Array<string | number>,
  ): string {
    if (!constraints.length) return '';
    // resolve every constraint first (registers joins), building predicate templates
    const built = constraints.map((c) => {
      const r = this.resolve(root, c.path, st);
      const p: Array<string | number> = [];
      const sql = r ? this.predicate(c, r, p) : '1=0';
      return {code: c.code, sql, params: p};
    });
    if (!logic) {
      built.forEach((b) => b.params.forEach((v) => params.push(v)));
      return `\nWHERE ${built.map((b) => b.sql).join('\n  AND ')}`;
    }
    const byCode = new Map(
      built.filter((b) => b.code).map((b) => [b.code!, b]),
    );
    const tokens = logic.match(/\(|\)|AND|OR|[A-Za-z][A-Za-z0-9]*/g) ?? [];
    const out: string[] = [];
    for (const t of tokens) {
      if (t === '(' || t === ')' || t === 'AND' || t === 'OR') {
        out.push(t === 'AND' || t === 'OR' ? ` ${t} ` : t);
      } else {
        const b = byCode.get(t);
        if (!b) {
          out.push('1=0');
          continue;
        }
        out.push(b.sql);
        b.params.forEach((v) => params.push(v));
      }
    }
    return `\nWHERE ${out.join('')}`;
  }

  build(
    root: string,
    view: string[],
    sort?: string,
    constraints: Constraint[] = [],
    constraintLogic?: string,
    opts: {limit?: number; offset?: number} = {},
    // Paths the caller declares OUTER (LEFT), matching InterMine's join factories.
    // InterMine joins every path INNER by default and only these are OUTER, so a
    // view reference that is null (e.g. a CDS with no transcript) drops the row
    // unless its path is listed here. Keys are the dotted path prefixes, e.g.
    // "CDS.chromosome". Constraint paths are always INNER regardless.
    outerJoins: string[] = [],
  ): BuiltQuery {
    if (!this.model.has(root))
      return {
        sql: '',
        params: [],
        columns: [],
        warnings: [`class "${root}" not in this mine's model`],
      };
    const st = this.state(root);
    const selectParams: Array<string | number> = []; // (none today; kept for symmetry)
    const selectCols: string[] = [];
    const columns: string[] = [];
    for (const path of view) {
      const r = this.resolve(root, path, st);
      selectCols.push(r ? (r.expr ?? `${r.alias}.${r.column}`) : 'NULL');
      columns.push(path);
    }
    const whereParams: Array<string | number> = [];
    const whereSql = this.where(
      root,
      constraints,
      constraintLogic,
      st,
      whereParams,
    );
    const orderSql = this.orderBy(root, sort, st);
    const outer = new Set(outerJoins);
    const joinSql = st.joins.order
      .map((k) => {
        const clause = st.joins.sql.get(k)!;
        // Join style follows the declaration only, like InterMine: a path is LEFT
        // iff declared OUTER (via outerJoins), else INNER — the default. A constraint
        // does NOT change the join style; for an equality constraint OUTER+WHERE is
        // equivalent to INNER anyway, but for NONE OF / IS NULL the OUTER declaration
        // matters (see getPanGenePairs). Clauses are generated with LEFT JOIN, so we
        // rewrite to INNER JOIN unless declared outer.
        const isLeft = outer.has(k);
        return isLeft ? clause : clause.replace(/LEFT JOIN/g, 'INNER JOIN');
      })
      .join('\n  ');
    // DISTINCT because InterMine returns distinct rows over the view: a join to a
    // collection (e.g. a constraint on GeneFunction.gene.panGeneSets.genes) fans
    // the root row out into one row per collection member, and without DISTINCT
    // those duplicates would surface as repeated results. All ported methods sort
    // by a column that is in the view, so DISTINCT + ORDER BY is well-defined.
    // (pathQueryCount slices from "\nFROM", so this SELECT clause doesn't affect
    // it — it applies its own DISTINCT on the root id.)
    let sql = `SELECT DISTINCT ${selectCols.join(', ')}\nFROM ${tableOf(root)} t0`;
    if (joinSql) sql += `\n  ${joinSql}`;
    sql += whereSql + orderSql;
    if (opts.limit != null) sql += `\nLIMIT ${opts.limit}`;
    if (opts.offset != null) sql += ` OFFSET ${opts.offset}`;
    return {
      sql,
      params: [...selectParams, ...whereParams],
      columns,
      warnings: st.warnings,
    };
  }
}
