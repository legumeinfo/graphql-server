import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLExpressionSample,
  IntermineExpressionSampleResponse,
  intermineExpressionSampleAttributes,
  intermineExpressionSampleSort,
  response2expressionSamples,
} from '../models/index.js';
import { PaginationOptions, defaultPaginationOptions } from './pagination.js';


export type SearchExpressionSamplesOptions = {
  description?: string;
} & PaginationOptions;


// path query search for ExpressionSample by description
export async function searchExpressionSamples(
  {
    description,
    start=defaultPaginationOptions.start,
    size=defaultPaginationOptions.size,
  }: SearchExpressionSamplesOptions,
): Promise<GraphQLExpressionSample[]> {
    const constraints = [];
    if (description) {
        const descriptionConstraint = intermineConstraint('ExpressionSample.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = interminePathQuery(
        intermineExpressionSampleAttributes,
        intermineExpressionSampleSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: IntermineExpressionSampleResponse) => response2expressionSamples(response));
}
