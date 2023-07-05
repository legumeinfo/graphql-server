import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLBioEntity,
    GraphQLDataSet,
    GraphQLGeneticMap,
    GraphQLLinkageGroup,
    GraphQLLocation,
    GraphQLOntology,
    GraphQLOntologyAnnotation,
    GraphQLOntologyTerm,
    GraphQLPanGeneSet,
    GraphQLPathway,
    GraphQLPhylotree,
    GraphQLSyntenyBlock,
    IntermineDataSetResponse,
    intermineDataSetAttributes,
    intermineDataSetSort,
    intermineGeneticMapDataSetAttributes,
    intermineGeneticMapDataSetSort,
    intermineLinkageGroupDataSetAttributes,
    intermineLinkageGroupDataSetSort,
    intermineLocationDataSetAttributes,
    intermineLocationDataSetSort,
    intermineOntologyAnnotationDataSetAttributes,
    intermineOntologyAnnotationDataSetSort,
    intermineOntologyDataSetAttributes,
    intermineOntologyDataSetSort,
    intermineOntologyTermDataSetAttributes,
    intermineOntologyTermDataSetSort,
    interminePanGeneSetDataSetAttributes,
    interminePanGeneSetDataSetSort,
    interminePathwayDataSetAttributes,
    interminePathwayDataSetSort,
    interminePhylotreeDataSetAttributes,
    interminePhylotreeDataSetSort,
    intermineSyntenyBlockDataSetAttributes,
    intermineSyntenyBlockDataSetSort,
    response2dataSets,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export async function getDataSetsForBioEntity(
    bioEntity: GraphQLBioEntity,
    {
        page,
        pageSize,
    }: PaginationOptions,
): Promise<ApiResponse<GraphQLDataSet>> {
    const constraints = [intermineConstraint('DataSet.bioEntities.id', '=', bioEntity.id)];
    const query = interminePathQuery(
        intermineDataSetAttributes,
        intermineDataSetSort,
        constraints,
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


export async function getDataSetsForGeneticMap(
    geneticMap: GraphQLGeneticMap,
    {
        page,
        pageSize,
    }: PaginationOptions,
): Promise<ApiResponse<GraphQLDataSet>> {
    const constraints = [intermineConstraint('GeneticMap.id', '=', geneticMap.id)];
    const query = interminePathQuery(
        intermineGeneticMapDataSetAttributes,
        intermineGeneticMapDataSetSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineDataSetResponse) => response2dataSets(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'GeneticMap.dataSets.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}


export async function getDataSetsForLinkageGroup(
    linkageGroup: GraphQLLinkageGroup,
    {
        page,
        pageSize,
    }: PaginationOptions,
): Promise<ApiResponse<GraphQLDataSet>> {
    const constraints = [intermineConstraint('LinkageGroup.id', '=', linkageGroup.id)];
    const query = interminePathQuery(
        intermineLinkageGroupDataSetAttributes,
        intermineLinkageGroupDataSetSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineDataSetResponse) => response2dataSets(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'LinkageGroup.dataSets.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}


export async function getDataSetsForLocation(
    location: GraphQLLocation,
    {
        page,
        pageSize,
    }: PaginationOptions,
): Promise<ApiResponse<GraphQLDataSet>> {
    const constraints = [intermineConstraint('Location.id', '=', location.id)];
    const query = interminePathQuery(
        intermineLocationDataSetAttributes,
        intermineLocationDataSetSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query,  {page, pageSize})
        .then((response: IntermineDataSetResponse) => response2dataSets(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Location.dataSets.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}


export async function getDataSetsForOntology(
    ontology: GraphQLOntology,
    {
        page,
        pageSize,
    }: PaginationOptions,
): Promise<ApiResponse<GraphQLDataSet>> {
    const constraints = [intermineConstraint('Ontology.id', '=', ontology.id)];
    const query = interminePathQuery(
        intermineOntologyDataSetAttributes,
        intermineOntologyDataSetSort,
        constraints,
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
}


export async function getDataSetsForOntologyAnnotation(
    ontologyAnnotation: GraphQLOntologyAnnotation,
    {
        page,
        pageSize,
    }: PaginationOptions,
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


export async function getDataSetsForOntologyTerm(
    ontologyTerm: GraphQLOntologyTerm,
    {
        page,
        pageSize,
    }: PaginationOptions,
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

export async function getDataSetsForPanGeneSet(
    panGeneSet: GraphQLPanGeneSet,
    {
        page,
        pageSize,
    }: PaginationOptions,
): Promise<ApiResponse<GraphQLDataSet>> {
    const constraints = [intermineConstraint('PanGeneSet.primaryIdentifier', '=', panGeneSet.identifier)];
    const query = interminePathQuery(
        interminePanGeneSetDataSetAttributes,
        interminePanGeneSetDataSetSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineDataSetResponse) => response2dataSets(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'PanGeneSet.dataSets.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

export async function getDataSetsForPathway(
    pathway: GraphQLPathway,
    {
        page,
        pageSize,
    }: PaginationOptions,
): Promise<ApiResponse<GraphQLDataSet>> {
    const constraints = [intermineConstraint('Pathway.id', '=', pathway.id)];
    const query = interminePathQuery(
        interminePathwayDataSetAttributes,
        interminePathwayDataSetSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineDataSetResponse) => response2dataSets(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Pathway.dataSets.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

export async function getDataSetsForPhylotree(
    phylotree: GraphQLPhylotree,
    {
        page,
        pageSize,
    }: PaginationOptions,
): Promise<ApiResponse<GraphQLDataSet>> {
    const constraints = [intermineConstraint('Phylotree.id', '=', phylotree.id)];
    const query = interminePathQuery(
        interminePhylotreeDataSetAttributes,
        interminePhylotreeDataSetSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineDataSetResponse) => response2dataSets(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Phylotree.dataSets.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}


export async function getDataSetsForSyntenyBlock(
    syntenyBlock: GraphQLSyntenyBlock,
    {
        page,
        pageSize,
    }: PaginationOptions,
): Promise<ApiResponse<GraphQLDataSet>> {
    const constraints = [intermineConstraint('SyntenyBlock.id', '=', syntenyBlock.id)];
    const query = interminePathQuery(
        intermineSyntenyBlockDataSetAttributes,
        intermineSyntenyBlockDataSetSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineDataSetResponse) => response2dataSets(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'SyntenyBlock.dataSets.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
