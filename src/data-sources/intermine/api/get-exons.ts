import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLExon,
    IntermineExonResponse,
    intermineExonAttributes,
    intermineExonSort,
    response2exons,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// Get Exons associated with a Transcript
export async function getExonsForTranscript(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLExon>> {
    const constraints = [intermineConstraint('Exon.transcripts.id', '=', id)];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('Exon.chromosome', 'OUTER'),
        intermineJoin('Exon.supercontig', 'OUTER'),
        intermineJoin('Exon.chromosomeLocation', 'OUTER'),
        intermineJoin('Exon.supercontigLocation', 'OUTER'),
        intermineJoin('Exon.sequenceOntologyTerm', 'OUTER')
    ];
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
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Exon.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
