import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    intermineJoin,
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

// get childFeatures (SequenceFeature) of a SequenceFeature
export async function getChildFeaturesForSequenceFeature(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLSequenceFeature>> {
    const constraints = [intermineConstraint('SequenceFeature.id', '=', id)];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('SequenceFeature.childFeatures.chromosome', 'OUTER'),
        intermineJoin('SequenceFeature.childFeatures.supercontig', 'OUTER'),
        intermineJoin('SequenceFeature.childFeatures.chromosomeLocation', 'OUTER'),
        intermineJoin('SequenceFeature.childFeatures.supercontigLocation', 'OUTER'),
        intermineJoin('SequenceFeature.childFeatures.sequenceOntologyTerm', 'OUTER'),
    ];
    const query = interminePathQuery(
        intermineSequenceFeatureChildFeatureAttributes,
        intermineSequenceFeatureChildFeatureSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineSequenceFeatureResponse) => response2sequenceFeatures(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'SequenceFeature.childFeatures.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get overlappingFeatures (SequenceFeatures) for a SequenceFeature
export async function getOverlappingFeaturesForSequenceFeature(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLSequenceFeature>> {
    const constraints = [intermineConstraint('SequenceFeature.id', '=', id)];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('SequenceFeature.overlappingFeatures.chromosome', 'OUTER'),
        intermineJoin('SequenceFeature.overlappingFeatures.supercontig', 'OUTER'),
        intermineJoin('SequenceFeature.overlappingFeatures.chromosomeLocation', 'OUTER'),
        intermineJoin('SequenceFeature.overlappingFeatures.supercontigLocation', 'OUTER'),
        intermineJoin('SequenceFeature.overlappingFeatures.sequenceOntologyTerm', 'OUTER'),
    ];
    const query = interminePathQuery(
        intermineOverlappingFeatureAttributes,
        intermineOverlappingFeatureSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineSequenceFeatureResponse) => response2sequenceFeatures(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'SequenceFeature.overlappingFeatures.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
