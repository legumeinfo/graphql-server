import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLAnnotatable,
    GraphQLDataSet,
    GraphQLDataSource,
    GraphQLLocation,
    GraphQLOntology,
    GraphQLOntologyTerm,
    IntermineDataSetResponse,
    intermineDataSetAttributes,
    intermineDataSetSort,
    intermineOntologyDataSetAttributes,
    intermineOntologyDataSetSort,
    intermineOntologyTermDataSetAttributes,
    intermineOntologyTermDataSetSort,
    response2dataSets,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

export type GetDataSetsOptions = {
    annotatable?: GraphQLAnnotatable;
    dataSource?: GraphQLDataSource;
    location?: GraphQLLocation;
    ontology?: GraphQLOntology;
    ontologyTerm?: GraphQLOntologyTerm;
} & PaginationOptions;

// get dataSets for an Annotatable, DataSource, Location, Ontology, or OntologyTerm
export async function getDataSets(
    {
        annotatable,
        dataSource,
        location,
        ontology,
        ontologyTerm,
        page,
        pageSize
    }: GetDataSetsOptions,
): Promise<ApiResponse<GraphQLDataSet>> {
    const constraints = [];
    if (annotatable || dataSource || location) {
        // these have a DataSet reverse reference
        if (annotatable) {
            constraints.push(intermineConstraint('DataSet.entities.id', '=', annotatable.id));
        } else if (dataSource) {
            constraints.push(intermineConstraint('DataSet.dataSource.id', '=', dataSource.id));
        } else if (location) {
            constraints.push(intermineConstraint('DataSet.entities.id', '=', location.id));
        }
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
    } else if (ontology) {
        // DataSet does not have a reverse reference to Ontology
        constraints.push(intermineConstraint('Ontology.id', '=', ontology.id));
        // publication may be null
        const joins = [
            intermineJoin('Ontology.dataSets.publication', 'OUTER'),
        ];
        const query = interminePathQuery(
            intermineOntologyDataSetAttributes,
            intermineOntologyDataSetSort,
            constraints,
            joins
        );
        // get the data
        const dataPromise = this.pathQuery(query, {page, pageSize})
            .then((response: IntermineDataSetResponse) => response2dataSets(response));
        // get a summary of the data and convert it to page info
        const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Ontology.dataSets.id'})
            .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
        // return the expected GraphQL type
        return Promise.all([dataPromise, pageInfoPromise])
            .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
    } else if (ontologyTerm) {
        // DataSet does not have a reverse reference to OntologyTerm
        constraints.push(intermineConstraint('OntologyTerm.id', '=', ontologyTerm.id));
        // publication may be null
        const joins = [
            intermineJoin('OntologyTerm.dataSets.publication', 'OUTER'),
        ];
        const query = interminePathQuery(
            intermineOntologyTermDataSetAttributes,
            intermineOntologyTermDataSetSort,
            constraints,
            joins
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
    } else {
        return null;
    }
}
