import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLOntologyTerm,
    IntermineOntologyTermResponse,
    intermineOntologyTermAttributes,
    intermineOntologyTermSort,
    response2ontologyTerms,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type SearchOntologyTermsOptions = {
    description?: string;
} & PaginationOptions;


// path query search for OntologyTerm by description
export async function searchOntologyTerms(
    {
        description,
        start,
        size,
    }: SearchOntologyTermsOptions,
): Promise<ApiResponse<GraphQLOntologyTerm[]>> {
    const constraints = [];
    if (description) {
        const descriptionConstraint = intermineConstraint('OntologyTerm.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = interminePathQuery(
        intermineOntologyTermAttributes,
        intermineOntologyTermSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {start, size})
        .then((response: IntermineOntologyTermResponse) => response2ontologyTerms(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'OntologyTerm.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, start, size));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
