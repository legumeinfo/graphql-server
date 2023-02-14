import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLExpressionSource,
  IntermineExpressionSourceResponse,
  intermineExpressionSourceAttributes,
  intermineExpressionSourceSort,
  response2expressionSources,
} from '../models/index.js';
import { PaginationOptions, defaultPaginationOptions } from './pagination.js';


export type SearchExpressionSourcesOptions = {
  description?: string;
} & PaginationOptions;


// path query search for ExpressionSource by description
export async function searchExpressionSources(
  {
    description,
    start=defaultPaginationOptions.start,
    size=defaultPaginationOptions.size,
  }: SearchExpressionSourcesOptions,
): Promise<GraphQLExpressionSource[]> {
    const constraints = [];
    if (description) {
        const descriptionConstraint = intermineConstraint('ExpressionSource.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = interminePathQuery(
        intermineExpressionSourceAttributes,
        intermineExpressionSourceSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: IntermineExpressionSourceResponse) => response2expressionSources(response));
}
