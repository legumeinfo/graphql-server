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
    GraphQLGene,
    GraphQLPanGeneSet,
    GraphQLTranscript,
    GraphQLUTR,
    IntermineTranscriptResponse,
    intermineTranscriptAttributes,
    intermineTranscriptSort,
    response2transcripts,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

export type GetTranscriptsOptions = {
    exon?: GraphQLExon;
    gene?: GraphQLGene;
    panGeneSet?: GraphQLPanGeneSet;
    utr?: GraphQLUTR;
} & PaginationOptions;

// Get transcripts associated with an Exon, Gene, PanGeneSet, or UTR.
export async function getTranscripts(
    {
        exon,
        gene,
        panGeneSet,
        utr,
        page,
        pageSize,
    }: GetTranscriptsOptions,
): Promise<ApiResponse<GraphQLTranscript[]>> {
    const constraints = [];
    if (exon) {
        constraints.push(intermineConstraint('Transcript.exons.id', '=', exon.id));
    }
    if (gene) {
        constraints.push(intermineConstraint('Transcript.gene.id', '=', gene.id));
    }
    if (panGeneSet) {
        constraints.push(intermineConstraint('Transcript.panGeneSets.id', '=', panGeneSet.id));
    }
    if (utr) {
        constraints.push(intermineConstraint('Transcript.UTRs.id', '=', utr.id));
    }
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('Transcript.chromosome', 'OUTER'),
        intermineJoin('Transcript.supercontig', 'OUTER'),
        intermineJoin('Transcript.chromosomeLocation', 'OUTER'),
        intermineJoin('Transcript.supercontigLocation', 'OUTER'),
        intermineJoin('Transcript.sequenceOntologyTerm', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineTranscriptAttributes,
        intermineTranscriptSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineTranscriptResponse) => response2transcripts(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Transcript.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
