import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLDataSet,
    IntermineDataSetResponse,
    intermineDataSetAttributes,
    intermineDataSetSort,
    intermineOntologyAnnotationDataSetAttributes,
    intermineOntologyAnnotationDataSetSort,
    // intermineOntologyDataSetAttributes,
    // intermineOntologyDataSetSort,
    // intermineOntologyTermDataSetAttributes,
    // intermineOntologyTermDataSetSort,
    response2dataSets,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// request = dataSources[sourceName].getDataSetsForAnnotatable(identifier, args);
// request = dataSources[sourceName].getDataSetsForDataSource(name, args);
// request = dataSources[sourceName].getDataSetsForGWASResult(id, args);
// request = dataSources[sourceName].getDataSetsForLocation(identifier, args);
// request = dataSources[sourceName].getDataSetsForOntology(name, args);
// request = dataSources[sourceName].getDataSetsForOntologyAnnotation(id, args);
// request = dataSources[sourceName].getDataSetsForOntologyTerm(identifier, args);
// request = dataSources[sourceName].getDataSetsForSOTerm(identifier, args);
// request = dataSources[sourceName].getDataSetsForSyntenyBlock(identifier, args);

// get DataSets for an Annotatable by id
export async function getDataSetsForAnnotatable(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLDataSet>> {
    const constraints = [
        intermineConstraint('DataSet.entities.id', '=', id),
    ];
    // publication may be null
    const joins = [
        intermineJoin('DataSet.publication', 'OUTER'), 
    ];
    const query = interminePathQuery(
        intermineDataSetAttributes,
        intermineDataSetSort,
        constraints,
        joins
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineDataSetResponse) => response2dataSets(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'DataSet.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get DataSets for a DataSource by id
export async function getDataSetsForDataSource(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLDataSet>> {
    const constraints = [
        intermineConstraint('DataSet.dataSource.id', '=', id),
    ];
    // publication may be null
    const joins = [
        intermineJoin('DataSet.publication', 'OUTER'), 
    ];
    const query = interminePathQuery(
        intermineDataSetAttributes,
        intermineDataSetSort,
        constraints,
        joins
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineDataSetResponse) => response2dataSets(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'DataSet.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get DataSets for an OntologyAnnotation, which has no reverse reference from DataSet
export async function getDataSetsForOntologyAnnotation(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLDataSet>> {
    const constraints = [intermineConstraint('OntologyAnnotation.id', '=', id)];
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

//     // these have a DataSet reverse reference
//     } else if (dataSource) {
//         constraints.push(intermineConstraint('DataSet.dataSource.id', '=', dataSource.id));
//     } else if (location) {
//         constraints.push(intermineConstraint('DataSet.entities.id', '=', location.id));
//     }

// } else if (ontology) {
//     // DataSet does not have a reverse reference to Ontology
//     constraints.push(intermineConstraint('Ontology.id', '=', ontology.id));
//     // publication may be null
//     const joins = [
//         intermineJoin('Ontology.dataSets.publication', 'OUTER'),
//     ];
//     const query = interminePathQuery(
//         intermineOntologyDataSetAttributes,
//         intermineOntologyDataSetSort,
//         constraints,
//         joins
//     );
//     // get the data
//     const dataPromise = this.pathQuery(query, {page, pageSize})
//         .then((response: IntermineDataSetResponse) => response2dataSets(response));
//     // get a summary of the data and convert it to page info
//     const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Ontology.dataSets.id'})
//         .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
//     // return the expected GraphQL type
//     return Promise.all([dataPromise, pageInfoPromise])
//         .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
// } else if (ontologyTerm) {
//     // DataSet does not have a reverse reference to OntologyTerm
//     constraints.push(intermineConstraint('OntologyTerm.id', '=', ontologyTerm.id));
//     // publication may be null
//     const joins = [
//         intermineJoin('OntologyTerm.dataSets.publication', 'OUTER'),
//     ];
//     const query = interminePathQuery(
//         intermineOntologyTermDataSetAttributes,
//         intermineOntologyTermDataSetSort,
//         constraints,
//         joins
//     );
//     // get the data
//     const dataPromise = this.pathQuery(query, {page, pageSize})
//         .then((response: IntermineDataSetResponse) => response2dataSets(response));
//     // get a summary of the data and convert it to page info
//     const pageInfoPromise = this.pathQuery(query, {summaryPath: 'OntologyTerm.dataSets.id'})
//         .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
//     // return the expected GraphQL type
//     return Promise.all([dataPromise, pageInfoPromise])
//         .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
// } else {
//     return null;
// }


// }
