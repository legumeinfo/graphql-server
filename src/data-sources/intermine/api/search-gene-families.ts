import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLGeneFamily,
  IntermineGeneFamilyResponse,
  intermineGeneFamilyAttributes,
  intermineGeneFamilySort,
  response2geneFamilies,
} from '../models/index.js';
import { PaginationOptions, defaultPaginationOptions } from './pagination.js';


export type SearchGeneFamiliesOptions = {
  description?: string;
} & PaginationOptions;


// path query search for GeneFamily by description
export async function searchGeneFamilies(
  {
    description,
    start=defaultPaginationOptions.start,
    size=defaultPaginationOptions.size,
  }: SearchGeneFamiliesOptions,
): Promise<GraphQLGeneFamily[]> {
    const constraints = [];
    if (description) {
        const descriptionConstraint = intermineConstraint('GeneFamily.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = interminePathQuery(
        intermineGeneFamilyAttributes,
        intermineGeneFamilySort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: IntermineGeneFamilyResponse) => response2geneFamilies(response));
}
