import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
    GraphQLBioEntity,
    GraphQLDataSet,
    GraphQLGeneticMap,
    GraphQLLinkageGroup,
    GraphQLLocation,
    GraphQLOntology,
    GraphQLOntologyAnnotation,
    GraphQLOntologyTerm,
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
        start,
        size,
    }: PaginationOptions,
): Promise<GraphQLDataSet> {
    const options = {start, size};
    const constraints = [intermineConstraint('DataSet.bioEntities.id', '=', bioEntity.id)];
    const query = interminePathQuery(
        intermineDataSetAttributes,
        intermineDataSetSort,
        constraints,
    );
    return this.pathQuery(query, options)
        .then((response: IntermineDataSetResponse) => response2dataSets(response));
}


export async function getDataSetsForGeneticMap(
    geneticMap: GraphQLGeneticMap,
    {
        start,
        size,
    }: PaginationOptions,
): Promise<GraphQLDataSet> {
    const options = {start, size};
    const constraints = [intermineConstraint('GeneticMap.id', '=', geneticMap.id)];
    const query = interminePathQuery(
        intermineGeneticMapDataSetAttributes,
        intermineGeneticMapDataSetSort,
        constraints,
    );
    return this.pathQuery(query, options)
        .then((response: IntermineDataSetResponse) => response2dataSets(response));
}


export async function getDataSetsForLinkageGroup(
    linkageGroup: GraphQLLinkageGroup,
    {
        start,
        size,
    }: PaginationOptions,
): Promise<GraphQLDataSet> {
    const options = {start, size};
    const constraints = [intermineConstraint('LinkageGroup.id', '=', linkageGroup.id)];
    const query = interminePathQuery(
        intermineLinkageGroupDataSetAttributes,
        intermineLinkageGroupDataSetSort,
        constraints,
    );
    return this.pathQuery(query, options)
        .then((response: IntermineDataSetResponse) => response2dataSets(response));
}


export async function getDataSetsForLocation(
    location: GraphQLLocation,
    {
        start,
        size,
    }: PaginationOptions,
): Promise<GraphQLDataSet> {
    const options = {start, size};
    const constraints = [intermineConstraint('Location.id', '=', location.id)];
    const query = interminePathQuery(
        intermineLocationDataSetAttributes,
        intermineLocationDataSetSort,
        constraints,
    );
    return this.pathQuery(query, options)
        .then((response: IntermineDataSetResponse) => response2dataSets(response));
}


export async function getDataSetsForOntology(
    ontology: GraphQLOntology,
    {
        start,
        size,
    }: PaginationOptions,
): Promise<GraphQLDataSet> {
    const options = {start, size};
    const constraints = [intermineConstraint('Ontology.id', '=', ontology.id)];
    const query = interminePathQuery(
        intermineOntologyDataSetAttributes,
        intermineOntologyDataSetSort,
        constraints,
    );
    return this.pathQuery(query, options)
        .then((response: IntermineDataSetResponse) => response2dataSets(response));
}


export async function getDataSetsForOntologyAnnotation(
    ontologyAnnotation: GraphQLOntologyAnnotation,
    {
        start,
        size,
    }: PaginationOptions,
): Promise<GraphQLDataSet> {
    const options = {start, size};
    const constraints = [intermineConstraint('OntologyAnnotation.id', '=', ontologyAnnotation.id)];
    const query = interminePathQuery(
        intermineOntologyAnnotationDataSetAttributes,
        intermineOntologyAnnotationDataSetSort,
        constraints,
    );
    return this.pathQuery(query, options)
        .then((response: IntermineDataSetResponse) => response2dataSets(response));
}


export async function getDataSetsForOntologyTerm(
    ontologyTerm: GraphQLOntologyTerm,
    {
        start,
        size,
    }: PaginationOptions,
): Promise<GraphQLDataSet> {
    const options = {start, size};
    const constraints = [intermineConstraint('OntologyTerm.id', '=', ontologyTerm.id)];
    const query = interminePathQuery(
        intermineOntologyTermDataSetAttributes,
        intermineOntologyTermDataSetSort,
        constraints,
    );
    return this.pathQuery(query, options)
        .then((response: IntermineDataSetResponse) => response2dataSets(response));
}


export async function getDataSetsForPathway(
    pathway: GraphQLPathway,
    {
        start,
        size,
    }: PaginationOptions,
): Promise<GraphQLDataSet> {
    const options = {start, size};
    const constraints = [intermineConstraint('Pathway.id', '=', pathway.id)];
    const query = interminePathQuery(
        interminePathwayDataSetAttributes,
        interminePathwayDataSetSort,
        constraints,
    );
    return this.pathQuery(query, options)
        .then((response: IntermineDataSetResponse) => response2dataSets(response));
}


export async function getDataSetsForPhylotree(
    phylotree: GraphQLPhylotree,
    {
        start,
        size,
    }: PaginationOptions,
): Promise<GraphQLDataSet> {
    const options = {start, size};
    const constraints = [intermineConstraint('Phylotree.id', '=', phylotree.id)];
    const query = interminePathQuery(
        interminePhylotreeDataSetAttributes,
        interminePhylotreeDataSetSort,
        constraints,
    );
    return this.pathQuery(query, options)
        .then((response: IntermineDataSetResponse) => response2dataSets(response));
}


export async function getDataSetsForSyntenyBlock(
    syntenyBlock: GraphQLSyntenyBlock,
    {
        start,
        size,
    }: PaginationOptions,
): Promise<GraphQLDataSet> {
    const options = {start, size};
    const constraints = [intermineConstraint('SyntenyBlock.id', '=', syntenyBlock.id)];
    const query = interminePathQuery(
        intermineSyntenyBlockDataSetAttributes,
        intermineSyntenyBlockDataSetSort,
        constraints,
    );
    return this.pathQuery(query, options)
        .then((response: IntermineDataSetResponse) => response2dataSets(response));
}
