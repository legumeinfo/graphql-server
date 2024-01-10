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
    intermineOntologyTermParentAttributes,
    intermineOntologyTermParentSort,
    response2ontologyTerms,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

export type GetOntologyTermParentsOptions = {
    ontologyTerm?: GraphQLOntologyTerm;
} & PaginationOptions;

// get parents of an ontology term, which have no reverse reference from OntologyTerm
export async function getOntologyTermParents(
    {ontologyTerm, page, pageSize}: GetOntologyTermParentsOptions,
): Promise<ApiResponse<GraphQLOntologyTerm>> {
    const constraints = [intermineConstraint('OntologyTerm.id', '=', ontologyTerm.id)];
    const query = interminePathQuery(
        intermineOntologyTermParentAttributes,
        intermineOntologyTermParentSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineOntologyTermResponse) => response2ontologyTerms(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'OntologyTerm.parents.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
