import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGene,
    IntermineGeneResponse,
    intermineGeneAttributes,
    intermineGeneSort,
    intermineIntergenicRegionAdjacentGeneAttributes,
    intermineIntergenicRegionAdjacentGeneSort,
    intermineQTLGenesAttributes,
    intermineQTLGenesSort,
    response2genes,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// get Genes associated with a GeneFamily
export async function getGenesForGeneFamily(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLGene>> {
    const constraints = [intermineConstraint('Gene.geneFamilyAssignments.geneFamily.id', '=', id)];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('Gene.chromosome', 'OUTER'),
        intermineJoin('Gene.supercontig', 'OUTER'),
        intermineJoin('Gene.chromosomeLocation', 'OUTER'),
        intermineJoin('Gene.supercontigLocation', 'OUTER'),
        intermineJoin('Gene.sequenceOntologyTerm', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineGeneAttributes,
        intermineGeneSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGeneResponse) => response2genes(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Gene.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get Genes associated with a PanGeneSet
export async function getGenesForPanGeneSet(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLGene>> {
    const constraints = [intermineConstraint('Gene.panGeneSets.id', '=', id)];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('Gene.chromosome', 'OUTER'),
        intermineJoin('Gene.supercontig', 'OUTER'),
        intermineJoin('Gene.chromosomeLocation', 'OUTER'),
        intermineJoin('Gene.supercontigLocation', 'OUTER'),
        intermineJoin('Gene.sequenceOntologyTerm', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineGeneAttributes,
        intermineGeneSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGeneResponse) => response2genes(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Gene.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get Genes associated with a Pathway
export async function getGenesForPathway(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLGene>> {
    const constraints = [intermineConstraint('Gene.pathways.id', '=', id)];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('Gene.chromosome', 'OUTER'),
        intermineJoin('Gene.supercontig', 'OUTER'),
        intermineJoin('Gene.chromosomeLocation', 'OUTER'),
        intermineJoin('Gene.supercontigLocation', 'OUTER'),
        intermineJoin('Gene.sequenceOntologyTerm', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineGeneAttributes,
        intermineGeneSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGeneResponse) => response2genes(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Gene.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get Genes associated with a Protein
export async function getGenesForProtein(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLGene>> {
    const constraints = [intermineConstraint('Gene.proteins.id', '=', id)];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('Gene.chromosome', 'OUTER'),
        intermineJoin('Gene.supercontig', 'OUTER'),
        intermineJoin('Gene.chromosomeLocation', 'OUTER'),
        intermineJoin('Gene.supercontigLocation', 'OUTER'),
        intermineJoin('Gene.sequenceOntologyTerm', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineGeneAttributes,
        intermineGeneSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGeneResponse) => response2genes(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Gene.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get Genes associated with a ProteinDomain
export async function getGenesForProteinDomain(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLGene>> {
    const constraints = [intermineConstraint('Gene.proteinDomains.id', '=', id)];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('Gene.chromosome', 'OUTER'),
        intermineJoin('Gene.supercontig', 'OUTER'),
        intermineJoin('Gene.chromosomeLocation', 'OUTER'),
        intermineJoin('Gene.supercontigLocation', 'OUTER'),
        intermineJoin('Gene.sequenceOntologyTerm', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineGeneAttributes,
        intermineGeneSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGeneResponse) => response2genes(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Gene.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get adjacent Genes for an IntergenicRegion by id
export async function getAdjacentGenesForIntergenicRegion(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLGene>> {
    const constraints = [intermineConstraint('IntergenicRegion.id', '=', id)];
    // all SequenceFeature object queries must include these joins
    const joins = [
        intermineJoin('IntergenicRegion.adjacentGenes.chromosome', 'OUTER'),
        intermineJoin('IntergenicRegion.adjacentGenes.supercontig', 'OUTER'),
        intermineJoin('IntergenicRegion.adjacentGenes.chromosomeLocation', 'OUTER'),
        intermineJoin('IntergenicRegion.adjacentGenes.supercontigLocation', 'OUTER'),
        intermineJoin('IntergenicRegion.adjacentGenes.sequenceOntologyTerm', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineIntergenicRegionAdjacentGeneAttributes,
        intermineIntergenicRegionAdjacentGeneSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGeneResponse) => response2genes(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'IntergenicRegion.adjacentGenes.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get Genes associated with a QTL, for which there is no reverse reference from Gene
export async function getGenesForQTL(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLGene>> {
    const constraints = [intermineConstraint('QTL.id', '=', id)];
    // all SequenceFeature object queries must include these joins
    const joins = [
        intermineJoin('QTL.genes.chromosome', 'OUTER'),
        intermineJoin('QTL.genes.supercontig', 'OUTER'),
        intermineJoin('QTL.genes.chromosomeLocation', 'OUTER'),
        intermineJoin('QTL.genes.supercontigLocation', 'OUTER'),
        intermineJoin('QTL.genes.sequenceOntologyTerm', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineQTLGenesAttributes,
        intermineQTLGenesSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGeneResponse) => response2genes(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'QTL.genes.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
