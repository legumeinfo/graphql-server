import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLIntron,
    IntermineIntronResponse,
    intermineIntronAttributes,
    intermineIntronSort,
    response2introns,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// Get Introns associated with a Gene
export async function getIntronsForGene(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLIntron>> {
    const constraints = [intermineConstraint('Intron.genes.id', '=', id)];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('Intron.chromosome', 'OUTER'),
        intermineJoin('Intron.supercontig', 'OUTER'),
        intermineJoin('Intron.chromosomeLocation', 'OUTER'),
        intermineJoin('Intron.supercontigLocation', 'OUTER'),
        intermineJoin('Intron.sequenceOntologyTerm', 'OUTER')
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

// Get Introns associated with a Transcript
export async function getIntronsForTranscript(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLIntron>> {
    const constraints = [constraints.push(intermineConstraint('Intron.transcripts.id', '=', id));
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('Intron.chromosome', 'OUTER'),
        intermineJoin('Intron.supercontig', 'OUTER'),
        intermineJoin('Intron.chromosomeLocation', 'OUTER'),
        intermineJoin('Intron.supercontigLocation', 'OUTER'),
        intermineJoin('Intron.sequenceOntologyTerm', 'OUTER')
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
