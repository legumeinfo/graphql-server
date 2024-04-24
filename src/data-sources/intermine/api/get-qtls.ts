import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLQTL,
    IntermineQTLResponse,
    intermineQTLAttributes,
    intermineQTLSort,
    response2qtls,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// get QTLs using the given query and returns the expected GraphQL types
async function getQTLs(pathQuery: string, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLQTL>> {
    // get the data
    const dataPromise = this.pathQuery(pathQuery, {page, pageSize})
        .then((response: IntermineQTLResponse) => response2qtls(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(pathQuery, {summaryPath: 'QTL.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get QTLs associated with a LinkageGroup
export async function getQTLsForLinkageGroup(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLQTL>> {
    const constraints = [intermineConstraint('QTL.linkageGroup.id', '=', id)];
    const query = interminePathQuery(
        intermineQTLAttributes,
        intermineQTLSort,
        constraints,
    );
    // get the data
    return getQTLs(query, { page, pageSize });
}

// get QTLs associated with a GeneticMarker
export async function getQTLsForGeneticMarker(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLQTL>> {
    const constraints = [intermineConstraint('QTL.markers.id', '=', id)];
    const query = interminePathQuery(
        intermineQTLAttributes,
        intermineQTLSort,
        constraints,
    );
    // get the data
    return getQTLs(query, { page, pageSize });
}

// get QTLs associated with a QTLStudy
export async function getQTLsForQTLStudy(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLQTL>> {
    const constraints = [intermineConstraint('QTL.qtlStudy.id', '=', id)];
    const query = interminePathQuery(
        intermineQTLAttributes,
        intermineQTLSort,
        constraints,
    );
    // get the data
    return getQTLs(query, { page, pageSize });
}

// get QTLs associated with a Trait
export async function getQTLsForTrait(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLQTL>> {
    const constraints = [intermineConstraint('QTL.trait.id', '=', id)];
    const query = interminePathQuery(
        intermineQTLAttributes,
        intermineQTLSort,
        constraints,
    );
    // get the data
    return getQTLs(query, { page, pageSize });
}
