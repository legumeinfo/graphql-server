import {
    ApiResponse,
    IntermineCountResponse,
    countResponse2graphqlPageInfo,
    intermineConstraint,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLExon,
    IntermineExonResponse,
    intermineExonAttributes,
    intermineExonSort,
    response2exons,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';
import { sequenceFeatureJoinFactory } from './sequence-feature.js';

// Get Exons associated with a Transcript
export async function getExonsForTranscript(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLExon>> {
    const constraints = [intermineConstraint('Exon.transcripts.id', '=', id)];
    const joins = sequenceFeatureJoinFactory('Exon');
    const query = interminePathQuery(
        intermineExonAttributes,
        intermineExonSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineExonResponse) => response2exons(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
