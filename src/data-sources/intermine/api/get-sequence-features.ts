import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    intermineOverlappingFeatureAttributes,
    intermineOverlappingFeatureSort,
    intermineSequenceFeatureChildFeatureAttributes,
    intermineSequenceFeatureChildFeatureSort,
    GraphQLSequenceFeature,
    IntermineSequenceFeatureResponse,
    response2sequenceFeatures,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';
import { sequenceFeatureJoinFactory } from './sequence-feature.js';

// get SequenceFeatures using the given query and returns the expected GraphQL types
export async function getSequenceFeatures(pathQuery: string, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLSequenceFeature>> {
    // get the data
    const dataPromise = this.pathQuery(pathQuery, {page, pageSize})
        .then((response: IntermineSequenceFeatureResponse) => response2sequenceFeatures(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(pathQuery, {summaryPath: 'SequenceFeature.childFeatures.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get childFeatures (SequenceFeature) of a SequenceFeature
export async function getChildFeaturesForSequenceFeature(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLSequenceFeature>> {
    const constraints = [intermineConstraint('SequenceFeature.id', '=', id)];
    const joins = sequenceFeatureJoinFactory('SequenceFeature.childFeatures');
    const query = interminePathQuery(
        intermineSequenceFeatureChildFeatureAttributes,
        intermineSequenceFeatureChildFeatureSort,
        constraints,
        joins,
    );
    // get the data
    return getSequenceFeatures(query, {page, pageSize});
}

// get overlappingFeatures (SequenceFeatures) for a SequenceFeature
export async function getOverlappingFeaturesForSequenceFeature(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLSequenceFeature>> {
    const constraints = [intermineConstraint('SequenceFeature.id', '=', id)];
    const joins = sequenceFeatureJoinFactory('SequenceFeature.overlappingFeatures');
    const query = interminePathQuery(
        intermineOverlappingFeatureAttributes,
        intermineOverlappingFeatureSort,
        constraints,
        joins,
    );
    // get the data
    return getSequenceFeatures(query, {page, pageSize});
}
