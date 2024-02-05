// get child features (SequenceFeature) childFeatures for any type that extends SequenceFeature
export async function getSequenceFeatureChildFeatures(
    {sequenceFeature, page, pageSize}: GetSequenceFeatureChildFeaturesOptions,
): Promise<ApiResponse<GraphQLSequenceFeature>> {
    const constraints = [
        intermineConstraint('SequenceFeature.id', '=', sequenceFeature.id)
    ];
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
  GraphQLSequenceFeature,
  IntermineSequenceFeatureResponse,
  response2sequenceFeatures,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetOverlappingFeaturesOptions = {
  sequenceFeature?: GraphQLSequenceFeature;
} & PaginationOptions;

// There is no reverse reference, SequenceFeature.overlappingFeatures can only be queried forward.
// <query name="" model="genomic" view="SequenceFeature.overlappingFeatures.primaryIdentifier" longDescription="" sortOrder="SequenceFeature.overlappingFeatures.primaryIdentifier asc">
//   <constraint path="SequenceFeature.id" op="=" value="12345678"/>
// </query>

// get overlappingFeatures (SequenceFeatures) for any type that extends SequenceFeature
export async function getOverlappingFeatures(
    {sequenceFeature, page, pageSize}: GetOverlappingFeaturesOptions,
): Promise<ApiResponse<GraphQLSequenceFeature>> {
    const constraints = [
        intermineConstraint('SequenceFeature.id', '=', sequenceFeature.id)
    ];
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
