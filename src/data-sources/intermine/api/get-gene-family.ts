import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLGeneFamily,
  IntermineGeneFamilyResponse,
  intermineGeneFamilyAttributes,
  intermineGeneFamilySort,
  response2geneFamilies,
} from '../models/index.js';
import { geneFamilyJoinFactory } from './gene-family.js';

// get a GeneFamily by ID
export async function getGeneFamily(
  identifier: string,
): Promise<ApiResponse<GraphQLGeneFamily>> {
  const constraints = [
    intermineConstraint('GeneFamily.primaryIdentifier', '=', identifier),
  ];
  const joins = geneFamilyJoinFactory();
  const query = interminePathQuery(
    intermineGeneFamilyAttributes,
    intermineGeneFamilySort,
    constraints,
    joins,
  );
  return this.pathQuery(query)
    .then((response: IntermineGeneFamilyResponse) =>
      response2geneFamilies(response),
    )
    .then((geneFamilies: Array<GraphQLGeneFamily>) => {
      if (!geneFamilies.length) return null;
      return geneFamilies[0];
    })
    .then((geneFamily: GraphQLGeneFamily) => ({data: geneFamily}));
}
