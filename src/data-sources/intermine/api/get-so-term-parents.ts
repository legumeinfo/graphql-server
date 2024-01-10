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
    intermineSOTermParentAttributes,
    intermineSOTermParentSort,
    response2ontologyTerms,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

export type GetSOTermParentsOptions = {
    soTerm?: GraphQLOntologyTerm;
} & PaginationOptions;

// get parents (ontology terms) of an sequence ontology term, which have no reverse reference from SOTerm
export async function getSOTermParents(
    {soTerm, page, pageSize}: GetSOTermParentsOptions,
): Promise<ApiResponse<GraphQLOntologyTerm>> {
    const constraints = [intermineConstraint('SOTerm.id', '=', soTerm.id)];
    const query = interminePathQuery(
        intermineSOTermParentAttributes,
        intermineSOTermParentSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineOntologyTermResponse) => response2ontologyTerms(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'SOTerm.parents.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
