import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGene,
    GraphQLIntron,
    GraphQLTranscript,
    IntermineIntronResponse,
    intermineIntronAttributes,
    intermineIntronSort,
    response2introns,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

export type GetIntronsOptions = {
    gene?: GraphQLGene;
    transcript?: GraphQLTranscript;
} & PaginationOptions;

// Get introns associated with a Gene or Transcript
export async function getIntrons(
    {
        gene,
        transcript,
        page,
        pageSize,
    }: GetIntronsOptions,
): Promise<ApiResponse<GraphQLIntron[]>> {
    const constraints = [];
    if (gene) {
        constraints.push(intermineConstraint('Intron.genes.id', '=', gene.id));
    }
    if (transcript) {
        constraints.push(intermineConstraint('Intron.transcripts.id', '=', transcript.id));
    }
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('Intron.chromosome', 'OUTER'),
        intermineJoin('Intron.supercontig', 'OUTER'),
        intermineJoin('Intron.chromosomeLocation', 'OUTER'),
        intermineJoin('Intron.supercontigLocation', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineIntronAttributes,
        intermineIntronSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineIntronResponse) => response2introns(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Intron.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
