import {
    ApiResponse,
    IntermineCountResponse,
    countResponse2graphqlPageInfo,
    intermineConstraint,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLIntron,
    IntermineIntronResponse,
    intermineIntronAttributes,
    intermineIntronSort,
    response2introns,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';
import { sequenceFeatureJoinFactory } from './sequence-feature.js';

// get Introns using the given query and returns the expected GraphQL types
async function getIntrons(pathQuery: string, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLIntron>> {
    // get the data
    const dataPromise = this.pathQuery(pathQuery, {page, pageSize})
        .then((response: IntermineIntronResponse) => response2introns(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(pathQuery)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get Introns associated with a Gene
export async function getIntronsForGene(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLIntron>> {
    const constraints = [intermineConstraint('Intron.genes.id', '=', id)];
    const joins = sequenceFeatureJoinFactory('Intron');
    const query = interminePathQuery(
        intermineIntronAttributes,
        intermineIntronSort,
        constraints,
        joins,
    );
    return getIntrons.call(this, query, {page, pageSize});
}

// get Introns associated with a Transcript
export async function getIntronsForTranscript(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLIntron>> {
    const constraints = [intermineConstraint('Intron.transcripts.id', '=', id)];
    const joins = sequenceFeatureJoinFactory('Intron');
    const query = interminePathQuery(
        intermineIntronAttributes,
        intermineIntronSort,
        constraints,
        joins,
    );
    return getIntrons.call(this, query, {page, pageSize});
}
