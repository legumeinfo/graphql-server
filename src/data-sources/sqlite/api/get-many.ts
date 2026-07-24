// get-many.ts — getX(identifiers[]) methods: an ONE OF lookup returning a list
// (no pagination). Mirrors intermine/api/get-genes.ts etc. The faceted getChromosomes
// / getGeneFamilies are search-shaped and live with the search batch.
import {SqliteServer, ApiResponse} from '../sqlite.server.js';
import type {Constraint} from '../path-resolver.js';
import {outerPaths} from './helpers.js';
import {
  GraphQLGene,
  intermineGeneAttributes,
  intermineGeneSort,
  response2genes,
} from '../../intermine/models/index.js';
import {geneJoinFactory} from '../../intermine/api/gene.js';

// get multiple Genes by identifier. Carries the InterMine `fields` short-circuit:
// if the only requested field is the identifier, echo them back without a query.
export async function getGenes(
  this: SqliteServer,
  identifiers: string[],
  fields: string[] = [],
): Promise<ApiResponse<GraphQLGene[]>> {
  if (fields.length === 1 && fields[0] === 'identifier') {
    return {
      data: identifiers.map((identifier) => ({identifier}) as GraphQLGene),
    };
  }
  const constraints: Constraint[] = [
    {path: 'Gene.primaryIdentifier', op: 'ONE OF', values: identifiers},
  ];
  const response = this.pathQuery(
    'Gene',
    intermineGeneAttributes,
    intermineGeneSort,
    constraints,
    undefined,
    undefined,
    outerPaths(geneJoinFactory()),
  );
  return {data: response2genes(response as any)};
}
