import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    intermineOntologyTermOntologyTermSynonymAttributes,
    intermineOntologyTermOntologyTermSynonymSort,
    GraphQLOntologyTermSynonym,
    IntermineOntologyTermSynonymResponse,
    response2ontologyTermSynonyms,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// get OntologyTermSynonyms for an OntologyTerm
export async function getOntologyTermSynonymsForOntologyTerm(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLOntologyTermSynonym>> {
    const constraints = [intermineConstraint('OntologyTerm.id', '=', id)];
    const query = interminePathQuery(
        intermineOntologyTermOntologyTermSynonymAttributes,
        intermineOntologyTermOntologyTermSynonymSort,
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
