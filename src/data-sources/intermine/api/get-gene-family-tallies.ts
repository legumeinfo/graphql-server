import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLGeneFamily,
  GraphQLGeneFamilyTally,
  IntermineGeneFamilyTallyResponse,
  intermineGeneFamilyTallyAttributes,
  intermineGeneFamilyTallySort,
  response2geneFamilyTallies,
} from '../models/index.js';
import { PaginationOptions, defaultPaginationOptions } from './pagination.js';


export type SearchGeneFamilyTalliesOptions = {
  geneFamily?: GraphQLGeneFamily;
} & PaginationOptions;


// get GeneFamilyTallies associated with a GeneFamily
export async function getGeneFamilyTallies(
  {
    geneFamily,
    start=defaultPaginationOptions.start,
    size=defaultPaginationOptions.size,
  }: SearchGeneFamilyTalliesOptions,
): Promise<GraphQLGeneFamilyTally[]> {
    const constraints = [];
    if (geneFamily) {
        const geneFamilyConstraint = intermineConstraint('GeneFamilyTally.geneFamily.id', '=', geneFamily.id);
        constraints.push(geneFamilyConstraint);
    }
    const query = interminePathQuery(
        intermineGeneFamilyTallyAttributes,
        intermineGeneFamilyTallySort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: IntermineGeneFamilyTallyResponse) => response2geneFamilyTallies(response));
}
