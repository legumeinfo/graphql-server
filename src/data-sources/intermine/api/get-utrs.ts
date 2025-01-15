import {
    ApiResponse,
    IntermineCountResponse,
    countResponse2graphqlPageInfo,
    intermineConstraint,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLUTR,
    IntermineUTRResponse,
    intermineUTRAttributes,
    intermineUTRSort,
    response2utrs,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';
import { sequenceFeatureJoinFactory } from './sequence-feature.js';

// Get UTRs associated with a Transcript
export async function getUTRsForTranscript(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLUTR>> {
    const constraints = [intermineConstraint('UTR.transcripts.id', '=', id)];
    const joins = sequenceFeatureJoinFactory('UTR');
    const query = interminePathQuery(
        intermineUTRAttributes,
        intermineUTRSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineUTRResponse) => response2utrs(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
