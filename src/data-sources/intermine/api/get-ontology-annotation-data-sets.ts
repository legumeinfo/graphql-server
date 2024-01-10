import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLDataSet,
    GraphQLOntologyAnnotation,
    IntermineDataSetResponse,
    intermineOntologyAnnotationDataSetAttributes,
    intermineOntologyAnnotationDataSetSort,
    response2dataSets,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

export type GetOntologyAnnotationDataSetsOptions = {
    ontologyAnnotation?: GraphQLOntologyAnnotation;
} & PaginationOptions;

// get dataSets for ontology annotations, which have no reverse reference from DataSet
export async function getOntologyAnnotationDataSets(
    {ontologyAnnotation, page, pageSize}: GetOntologyAnnotationDataSetsOptions,
): Promise<ApiResponse<GraphQLDataSet>> {
    const constraints = [intermineConstraint('OntologyAnnotation.id', '=', ontologyAnnotation.id)];
    const query = interminePathQuery(
        intermineOntologyAnnotationDataSetAttributes,
        intermineOntologyAnnotationDataSetSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineDataSetResponse) => response2dataSets(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'OntologyAnnotation.dataSets.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
