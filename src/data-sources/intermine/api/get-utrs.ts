import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLUTR,
    IntermineUTRResponse,
    intermineUTRAttributes,
    intermineUTRSort,
    response2utrs,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// Get UTRs associated with a Transcript
export async function getUTRsForTranscript(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLUTR>> {
    const constraints = [intermineConstraint('UTR.transcripts.id', '=', id)];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('UTR.chromosome', 'OUTER'),
        intermineJoin('UTR.supercontig', 'OUTER'),
        intermineJoin('UTR.chromosomeLocation', 'OUTER'),
        intermineJoin('UTR.supercontigLocation', 'OUTER'),
        intermineJoin('UTR.sequenceOntologyTerm', 'OUTER')
    ];
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
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'UTR.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
