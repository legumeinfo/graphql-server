import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    intermineOntologyTermSynonymAttributes,
    intermineOntologyTermSynonymSort,
    GraphQLOntologyTerm,
    GraphQLOntologyTermSynonym,
    IntermineOntologyTermSynonymResponse,
    response2ontologyTermSynonyms,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

export type GetOntologyTermSynonymsOptions = {
    ontologyTerm?: GraphQLOntologyTerm;
} & PaginationOptions;

// get synonyms of an ontology term, which have no reverse reference to OntologyTerm
export async function getOntologyTermSynonyms(
    {ontologyTerm, page, pageSize}: GetOntologyTermSynonymsOptions,
): Promise<ApiResponse<GraphQLOntologyTermSynonym>> {
    const constraints = [intermineConstraint('OntologyTerm.id', '=', ontologyTerm.id)];
    const query = interminePathQuery(
        intermineOntologyTermSynonymAttributes,
        intermineOntologyTermSynonymSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineOntologyTermSynonymResponse) => response2ontologyTermSynonyms(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'OntologyTerm.synonyms.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
