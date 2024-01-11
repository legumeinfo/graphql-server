import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
  intermineChildFeatureAttributes,
  intermineChildFeatureSort,
  GraphQLSequenceFeature,
  IntermineSequenceFeatureResponse,
  response2sequenceFeatures,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetChildFeaturesOptions = {
  sequenceFeature?: GraphQLSequenceFeature;
} & PaginationOptions;

// There is no reverse reference, SequenceFeature.childFeatures can only be queried forward.
// <query name="" model="genomic" view="SequenceFeature.childFeatures.primaryIdentifier" longDescription="" sortOrder="SequenceFeature.childFeatures.primaryIdentifier asc">
//   <constraint path="SequenceFeature.id" op="=" value="12345678"/>
// </query>

// get childFeatures (SequenceFeatures) for any type that extends SequenceFeature
export async function getChildFeatures(
    {sequenceFeature, page, pageSize}: GetChildFeaturesOptions,
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
        intermineChildFeatureAttributes,
        intermineChildFeatureSort,
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
