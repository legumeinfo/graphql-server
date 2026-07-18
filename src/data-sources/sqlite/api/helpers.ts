// helpers.ts — shared building blocks for the ported api/*.ts methods, so the ~90
// paginated methods and ~52 get-one methods don't each re-spell the same shape.
// Every ported method reuses the backend-agnostic model modules (intermine*Attributes,
// intermine*Sort, response2*); only the query construction differs from InterMine.
import {SqliteServer, ApiResponse, PageOpts} from '../sqlite.server.js';
import type {Constraint} from '../path-resolver.js';

export function firstOrNull<T>(rows: T[]): T | null {
  return rows.length ? rows[0] : null;
}

// Mirrors intermine's countResponse2graphqlPageInfo shape (numResults/pageSize/
// hasNextPage), computed from a SQLite count.
export function graphqlPageInfo(
  count: number,
  page?: number,
  pageSize?: number,
) {
  const ps = pageSize ?? 10;
  return {
    numResults: count,
    pageSize: ps,
    hasNextPage: (page ?? 1) * ps < count,
  };
}

type Transform<G> = (r: unknown) => G[];

// get-one: a single '=' constraint, first row or null, no count. Covers the ~52
// getX(identifier) methods. Multi-field lookups (e.g. getAuthor) are written out.
export function getOne<G>(
  root: string,
  field: string,
  attrs: string[],
  sort: string,
  transform: Transform<G>,
) {
  return function (
    this: SqliteServer,
    value: string | number,
  ): Promise<ApiResponse<G>> {
    const response = this.pathQuery(root, attrs, sort, [
      {path: `${root}.${field}`, op: '=', value},
    ]);
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
): ApiResponse<G[]> {
  const response = self.pathQuery(root, attrs, sort, constraints, logic, page);
  const {count} = self.pathQueryCount(root, constraints, logic);
  return {
    data: transform(response),
    metadata: {pageInfo: graphqlPageInfo(count, page.page, page.pageSize)},
  };
}

// relationship: a single '=' constraint on a path to the parent's id, paginated.
// Covers the ~74 getXsForY methods.
export function forParent<G>(
  root: string,
  parentPath: string,
  attrs: string[],
  sort: string,
  transform: Transform<G>,
) {
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
      ),
    );
  };
}
