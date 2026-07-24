// get-pan-gene-pairs.ts — the one non-CRUD method the web components need that
// wasn't covered by the get-one/relationship/search batches. Ported from
// intermine/api/get-pan-gene-pairs.ts; the structure is identical, only the two
// fetches go through SqliteServer.pathQuery instead of interminePathQuery.
//
// For the given query gene identifiers, find the pan-gene sets they belong to and
// return the OTHER genes in those sets (NONE OF the query identifiers), optionally
// filtered by the result gene's organism/strain/assembly/annotation. Gene.panGeneSets
// and Gene.panGeneSets.genes are declared OUTER (see the join factory), so a query
// gene in a set with no qualifying partner still contributes to the counts — which
// is why the resolver's declaration-wins join rule matters here (see path-resolver).
import {hasOwnProperty} from '../../../utils/index.js';
import {SqliteServer, ApiResponse} from '../sqlite.server.js';
import type {Constraint} from '../path-resolver.js';
import {outerPaths, graphqlPageInfo} from './helpers.js';
import {summaryResponse2graphqlResultsInfo} from '../../intermine/intermine.server.js';
import {intermineJoin} from '../../intermine/intermine.server.js';
import {
  GraphQLPanGenePair,
  interminePanGenePairAttributes,
  interminePanGenePairSort,
  response2panGenePairs,
} from '../../intermine/models/index.js';
import {PaginationOptions} from '../../intermine/api/pagination.js';

export type GetPanGenePairsOptions = {
  genus?: string;
  species?: string;
  strain?: string;
  assembly?: string;
  annotation?: string;
} & PaginationOptions;

export async function getPanGenePairs(
  this: SqliteServer,
  identifiers: string[],
  {
    genus,
    species,
    strain,
    assembly,
    annotation,
    page,
    pageSize,
  }: GetPanGenePairsOptions,
): Promise<ApiResponse<GraphQLPanGenePair[]>> {
  const constraints: Constraint[] = [
    {path: 'Gene.primaryIdentifier', op: 'ONE OF', values: identifiers},
    {
      path: 'Gene.panGeneSets.genes.primaryIdentifier',
      op: 'NONE OF',
      values: identifiers,
    },
  ];
  if (genus)
    constraints.push({
      path: 'Gene.panGeneSets.genes.organism.genus',
      op: '=',
      value: genus,
    });
  if (species)
    constraints.push({
      path: 'Gene.panGeneSets.genes.organism.species',
      op: '=',
      value: species,
    });
  if (strain)
    constraints.push({
      path: 'Gene.panGeneSets.genes.strain.identifier',
      op: '=',
      value: strain,
    });
  if (assembly)
    constraints.push({
      path: 'Gene.panGeneSets.genes.assemblyVersion',
      op: '=',
      value: assembly,
    });
  if (annotation)
    constraints.push({
      path: 'Gene.panGeneSets.genes.annotationVersion',
      op: '=',
      value: annotation,
    });
  const outerJoins = outerPaths([
    intermineJoin('Gene.panGeneSets'),
    intermineJoin('Gene.panGeneSets.genes'),
  ]);

  // Paginated data.
  const response = this.pathQuery<[string, string, string]>(
    'Gene',
    interminePanGenePairAttributes,
    interminePanGenePairSort,
    constraints,
    undefined,
    {page, pageSize},
    outerJoins,
  );
  const data = response2panGenePairs(response as any);

  // Unpaginated fetch, for the count and the per-query-gene summary. Matches the
  // InterMine method, which counts the un-outer-joined rows itself rather than
  // trusting a COUNT that would over/under-count across the collection joins.
  const all = this.pathQuery<[string, string, string]>(
    'Gene',
    interminePanGenePairAttributes,
    interminePanGenePairSort,
    constraints,
    undefined,
    undefined,
    outerJoins,
  );
  const count = all.results.length;
  const pageInfo = graphqlPageInfo(count, page, pageSize);

  const idCountMap = all.results.reduce(
    (map: Record<string, number>, [query, set, result]) => {
      if (set != null && result != null) {
        if (!hasOwnProperty(map, query)) map[query] = 0;
        map[query] += 1;
      }
      return map;
    },
    {} as Record<string, number>,
  );
  const resultsInfo = summaryResponse2graphqlResultsInfo({
    uniqueValues: Object.keys(idCountMap).length,
    results: Object.entries(idCountMap),
  });

  return {data, metadata: {pageInfo, resultsInfo}};
}
