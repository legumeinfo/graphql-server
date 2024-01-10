import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLDataSet,
    GraphQLOntologyTerm,
    IntermineDataSetResponse,
    intermineOntologyTermDataSetAttributes,
    intermineOntologyTermDataSetSort,
    response2dataSets,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

export type GetOntologyTermDataSetsOptions = {
    ontologyTerm?: GraphQLOntologyTerm;
} & PaginationOptions;

// get dataSets for ontology terms, which have no reverse reference from DataSet
export async function getOntologyTermDataSets(
    {ontologyTerm, page, pageSize}: GetOntologyTermDataSetsOptions,
): Promise<ApiResponse<GraphQLDataSet>> {
    const constraints = [intermineConstraint('OntologyTerm.id', '=', ontologyTerm.id)];
    const query = interminePathQuery(
        intermineOntologyTermDataSetAttributes,
        intermineOntologyTermDataSetSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineDataSetResponse) => response2dataSets(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'OntologyTerm.dataSets.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
