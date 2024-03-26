import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLCDS,
    IntermineCDSResponse,
    intermineCDSAttributes,
    intermineCDSSort,
    response2cdss,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// Get CDSs associated with a Transcript
export async function getCDSsForTranscript(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLCDS>> {
    const constraints = [intermineConstraint('CDS.transcript.id', '=', id)];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('CDS.chromosome', 'OUTER'),
        intermineJoin('CDS.supercontig', 'OUTER'),
        intermineJoin('CDS.chromosomeLocation', 'OUTER'),
        intermineJoin('CDS.supercontigLocation', 'OUTER'),
        intermineJoin('CDS.sequenceOntologyTerm', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineCDSAttributes,
        intermineCDSSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineCDSResponse) => response2cdss(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'CDS.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
