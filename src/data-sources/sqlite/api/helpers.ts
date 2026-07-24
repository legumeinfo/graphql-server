// helpers.ts — shared building blocks for the ported api/*.ts methods, so the ~90
// paginated methods and ~52 get-one methods don't each re-spell the same shape.
// Every ported method reuses the backend-agnostic model modules (intermine*Attributes,
// intermine*Sort, response2*); only the query construction differs from InterMine.
import {SqliteServer, ApiResponse, PageOpts} from '../sqlite.server.js';
import type {Constraint} from '../path-resolver.js';
import {result2graphqlObject} from '../../intermine/intermine.server.js';
import {pageInfoFactory} from '../../../models/index.js';

export function firstOrNull<T>(rows: T[]): T | null {
  return rows.length ? rows[0] : null;
}

// The abstract/polymorphic roots (SequenceFeature, Location, Transcript, BioEntity,
// Annotatable) are fetched by InterMine as `jsonobjects` and mapped by object2result,
// which has a quirk we reproduce for 1-to-1 fidelity: an ABSENT reference's leaf
// value falls back to the ROOT object's same-named leaf. Query with the OBJECT
// attributes (LEFT joins -> null for an absent ref), then patch each null ref-leaf
// with the root's `<Root>.<leaf>` value. `.class` is stripped to its short name by
// the resolver; `.objectId` resolves like `.id`.
export const objectTransform =
  (objectAttrs: string[], graphqlAttrs: string[]) =>
  (resp: unknown): any[] =>
    ((resp as {results?: unknown[][]}).results ?? []).map((row) => {
      const patched = row.map((val, i) => {
        if (val != null) return val;
        const segs = objectAttrs[i].split('.');
        if (segs.length <= 2) return val; // a root scalar, nothing to fall back to
        const leaf = segs[segs.length - 1];
        const rootIdx = objectAttrs.indexOf(`${segs[0]}.${leaf}`);
        return rootIdx >= 0 ? row[rootIdx] : val;
      });
      return result2graphqlObject(patched as any, graphqlAttrs);
    });

// Same PageInfo as intermine's countResponse2graphqlPageInfo, computed from a
// SQLite count: both delegate to pageInfoFactory, so the full shape
// (currentPage/pageSize/numResults/pageCount/hasPreviousPage/hasNextPage) matches.
// The web components read pageCount/currentPage for their pagination UI, and the
// compat suite only diffs numResults, so producing the fuller shape is free there.
export function graphqlPageInfo(
  count: number,
  page?: number,
  pageSize?: number,
) {
  return pageInfoFactory(count, page ?? null, pageSize ?? null);
}

// `any` input so the model's response2X (typed for its IntermineXResponse) is
// assignable without a cast at each call site.
type Transform<G> = (r: any) => G[];

// Extract the OUTER-declared paths from an InterMine join factory's output (an
// array of `<join path='X' style='OUTER'/>` strings), for pass-through as the
// resolver's outerJoins. Lets the ported methods reuse the InterMine factories
// verbatim rather than re-listing which references are optional.
export function outerPaths(joins: string[]): string[] {
  return joins
    .filter((j) => j.includes("style='OUTER'"))
    .map((j) => /path='([^']+)'/.exec(j)?.[1] ?? '')
    .filter(Boolean);
}

// get-one: a single '=' constraint, first row or null, no count. Covers the ~52
// getX(identifier) methods. Multi-field lookups (e.g. getAuthor) are written out.
export function getOne<G>(
  root: string,
  field: string,
  attrs: string[],
  sort: string,
  transform: Transform<G>,
  outerJoins: string[] = [],
) {
  return function (
    this: SqliteServer,
    value: string | number,
  ): Promise<ApiResponse<G>> {
    const response = this.pathQuery(
      root,
      attrs,
      sort,
      [{path: `${root}.${field}`, op: '=', value}],
      undefined,
      undefined,
      outerJoins,
    );
    return Promise.resolve({data: firstOrNull(transform(response)) as G});
  };
}

// paginated fetch + count, returning {data, metadata:{pageInfo}}. Covers the
// relationship (getXsForY), get-many, and search methods. `constraints`/`logic`
// are built by the caller.
export function pageQuery<G>(
  self: SqliteServer,
  root: string,
  attrs: string[],
  sort: string,
  transform: Transform<G>,
  constraints: Constraint[],
  logic: string | undefined,
  page: PageOpts,
  outerJoins: string[] = [],
): ApiResponse<G[]> {
  const response = self.pathQuery(
    root,
    attrs,
    sort,
    constraints,
    logic,
    page,
    outerJoins,
  );
  // Count the distinct data rows (matches a collection view too), not distinct roots.
  const {count} = self.pathQueryCountView(
    root,
    attrs,
    constraints,
    logic,
    outerJoins,
  );
  return {
    data: transform(response),
    metadata: {pageInfo: graphqlPageInfo(count, page.page, page.pageSize)},
  };
}

// relationship: a single '=' constraint on a path to the parent's id, paginated.
// Covers the ~81 getXsForY methods. `root` is the constraint path's first segment.
export function forParent<G>(
  parentPath: string,
  attrs: string[],
  sort: string,
  transform: Transform<G>,
  outerJoins: string[] = [],
) {
  const root = parentPath.split('.')[0];
  return function (
    this: SqliteServer,
    id: number,
    page: PageOpts = {},
  ): Promise<ApiResponse<G[]>> {
    const constraints: Constraint[] = [{path: parentPath, op: '=', value: id}];
    return Promise.resolve(
      pageQuery(
        this,
        root,
        attrs,
        sort,
        transform,
        constraints,
        undefined,
        page,
        outerJoins,
      ),
    );
  };
}
