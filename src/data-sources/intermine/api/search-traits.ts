import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLTrait,
    IntermineTraitResponse,
    intermineTraitAttributes,
    intermineTraitSort,
    response2traits,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type SearchTraitsOptions = {
    name?: string;
} & PaginationOptions;


// path query search for Traits by name
// NOTE: description is typically empty, as it describes the methods used to measure the trait.
export async function searchTraits(
    {
        name,
        page,
        pageSize,
    }: SearchTraitsOptions,
): Promise<ApiResponse<GraphQLTrait[]>> {
    const constraints = [];
    if (name) {
        const nameConstraint = intermineConstraint('Trait.name', 'CONTAINS', name);
        constraints.push(nameConstraint);
    }
    const query = interminePathQuery(
        intermineTraitAttributes,
        intermineTraitSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineTraitResponse) => response2traits(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Trait.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
