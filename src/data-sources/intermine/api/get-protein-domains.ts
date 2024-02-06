import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLProteinDomain,
    IntermineProteinDomainResponse,
    intermineProteinDomainAttributes,
    intermineProteinDomainSort,
    intermineProteinDomainChildFeatureAttributes,
    intermineProteinDomainChildFeatureSort,
    intermineProteinDomainParentFeatureAttributes,
    intermineProteinDomainParentFeatureSort,
    response2proteinDomains,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// get ProteinDomains for a Gene given its id
export async function getProteinDomainsForGene(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLProteinDomain>> {
    const constraints = [intermineConstraint('ProteinDomain.genes.id', '=', id)];
    const query = interminePathQuery(
        intermineProteinDomainAttributes,
        intermineProteinDomainSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineProteinDomainResponse) => response2proteinDomains(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'ProteinDomain.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get ProteinDomains for a GeneFamily given its id
export async function getProteinDomainsForGeneFamily(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLProteinDomain>> {
    const constraints = [intermineConstraint('ProteinDomain.geneFamilies.id', '=', id)];
    const query = interminePathQuery(
        intermineProteinDomainAttributes,
        intermineProteinDomainSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineProteinDomainResponse) => response2proteinDomains(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'ProteinDomain.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get child features (ProteinDomain) for a ProteinDomain given its id
export async function getChildFeaturesForProteinDomain(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLProteinDomain>> {
    const constraints = [intermineConstraint('ProteinDomain.id', '=', id)];
    const query = interminePathQuery(
        intermineProteinDomainChildFeatureAttributes,
        intermineProteinDomainChildFeatureSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineProteinDomainResponse) => response2proteinDomains(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'ProteinDomain.childFeatures.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get parentFeatures (ProteinDomain) for a ProteinDomain given its id
export async function getParentFeaturesForProteinDomain(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLProteinDomain>> {
    const constraints = [intermineConstraint('ProteinDomain.id', '=', id)];
    const query = interminePathQuery(
        intermineProteinDomainParentFeatureAttributes,
        intermineProteinDomainParentFeatureSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineProteinDomainResponse) => response2proteinDomains(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'ProteinDomain.parentFeatures.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
