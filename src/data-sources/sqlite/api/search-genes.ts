import {SqliteServer, ApiResponse} from '../sqlite.server.js';
import type {Constraint} from '../path-resolver.js';
import {
  GraphQLGene,
  intermineGeneAttributes,
  intermineGeneSort,
  response2genes,
} from '../../intermine/models/index.js';
import {PaginationOptions} from '../../intermine/api/pagination.js';
import {geneJoinFactory} from '../../intermine/api/gene.js';
import {outerPaths, graphqlPageInfo} from './helpers.js';

export type SearchGenesOptions = {
  description?: string;
  genus?: string;
  species?: string;
  strain?: string;
  identifier?: string;
  name?: string;
  geneFamilyIdentifier?: string;
  panGeneSetIdentifier?: string;
} & Partial<PaginationOptions>;

// Mirrors intermine/api/search-genes.ts; only query construction differs.
export async function searchGenes(
  this: SqliteServer,
  o: SearchGenesOptions,
): Promise<ApiResponse<GraphQLGene[]>> {
  const c: Constraint[] = [];
  if (o.description)
    c.push({path: 'Gene.description', op: 'CONTAINS', value: o.description});
  if (o.genus) c.push({path: 'Gene.organism.genus', op: '=', value: o.genus});
  if (o.species)
    c.push({path: 'Gene.organism.species', op: '=', value: o.species});
  if (o.strain)
    c.push({path: 'Gene.strain.identifier', op: '=', value: o.strain});
  if (o.identifier)
    c.push({
      path: 'Gene.primaryIdentifier',
      op: 'CONTAINS',
      value: o.identifier,
    });
  if (o.name) c.push({path: 'Gene.name', op: 'CONTAINS', value: o.name});
  if (o.geneFamilyIdentifier)
    c.push({
      path: 'Gene.geneFamilyAssignments.geneFamily.primaryIdentifier',
      op: 'CONTAINS',
      value: o.geneFamilyIdentifier,
    });
  if (o.panGeneSetIdentifier)
    c.push({
      path: 'Gene.panGeneSets.primaryIdentifier',
      op: 'CONTAINS',
      value: o.panGeneSetIdentifier,
    });

  // strain flips to an INNER join when filtering by strain, matching InterMine.
  const joins = geneJoinFactory(o.strain ? {strainJoinType: 'INNER'} : {});
  const response = this.pathQuery(
    'Gene',
    intermineGeneAttributes,
    intermineGeneSort,
    c,
    undefined,
    {page: o.page, pageSize: o.pageSize},
    outerPaths(joins),
  );
  const {count} = this.pathQueryCount('Gene', c);
  return {
    data: response2genes(response as any),
    metadata: {pageInfo: graphqlPageInfo(count, o.page, o.pageSize)},
  };
}
