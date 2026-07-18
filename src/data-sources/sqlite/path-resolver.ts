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
  guessIndirection,
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
  // Path prefixes that must be INNER-joined. A path used in a CONSTRAINT requires
  // that path to exist (InterMine joins every path INNER by default; OUTER is only
  // for paths explicitly declared so). A path used only in the view/sort stays
  // LEFT so it can't drop root rows. This is what makes an OR'd constraint on a
  // collection exclude non-matching root rows the way InterMine does — see the
  // gf/gene-without-pangeneset compat case.
  inner: Set<string>;
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
      inner: new Set(),
    };
    joins.alias.set(root, 't0');
    return {joins, counter: {n: 0}, warnings: []};
  }

  // Walk a path; register (and dedup) joins; return terminal {alias, column, cls}.
  // For object endpoints (ref/collection) column is the PK and cls is that object's class.
  // `forConstraint` marks every join along the path INNER (see JoinReg.inner).
  private resolve(
    root: string,
    path: string,
    st: State,
    forConstraint = false,
  ): Resolved | null {
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
        return {alias, column: attrCol(seg), cls: cur};
      }
      const nextPrefix = `${prefix}.${seg}`;
      if (!st.joins.alias.has(nextPrefix)) {
        const nextAlias = `t${++st.counter.n}`;
        if (f.kind === 'ref') {
          const R = f.def.referencedType;
          // optimization: `X.ref.id` equals the FK column `X.refid` already on the
          // source row — no join, and the referenced table need not be present.
          if (i + 1 === segs.length - 1 && segs[i + 1] === 'id') {
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
            if (ABSENT_COLLECTIONS.has(key)) {
              st.warnings.push(
                `collection ${key} is not materialized in this mine (returns empty)`,
              );
              return null;
            }
            const spec = INDIRECTION[key] ?? guessIndirection(cur, seg, R);
            if ((spec as any).guessed)
              st.warnings.push(
                `indirection for ${key} GUESSED as ${spec.table} — verify against pg_dump`,
              );
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
      // Mark inner even when the join already existed (a view path may have
      // registered it LEFT first); a constraint on the path upgrades it.
      if (forConstraint) st.joins.inner.add(nextPrefix);
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
    const col = `${r.alias}.${r.column}`;
    switch (c.op) {
      case 'IS NULL':
        return `${col} IS NULL`;
      case 'IS NOT NULL':
        return `${col} IS NOT NULL`;
      case 'CONTAINS':
        params.push(`%${c.value}%`);
        return `${col} LIKE ?`;
      case 'ONE OF':
      case 'NONE OF': {
        const vals = c.values ?? [];
        vals.forEach((v) => params.push(v));
        return `${col} ${c.op === 'ONE OF' ? 'IN' : 'NOT IN'} (${vals.map(() => '?').join(', ')})`;
      }
      default:
        params.push(c.value as string | number);
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
      if (r) parts.push(`${r.alias}.${r.column}${dir}`);
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
      const r = this.resolve(root, c.path, st, /* forConstraint */ true);
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
      selectCols.push(r ? `${r.alias}.${r.column}` : 'NULL');
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
    const joinSql = st.joins.order
      .map((k) => {
        const clause = st.joins.sql.get(k)!;
        // Constraint paths are INNER (JoinReg.inner); the clauses are generated
        // with LEFT JOIN, so this only rewrites our own keyword.
        return st.joins.inner.has(k)
          ? clause.replace(/LEFT JOIN/g, 'INNER JOIN')
          : clause;
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
