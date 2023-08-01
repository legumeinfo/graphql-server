import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGene,
    IntermineGeneResponse,
    interminePangeneAttributes,
    interminePangeneSort,
    response2genes,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// get pangenes for a Gene
export async function getPangenes(
    gene: GraphQLGene,
    {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLGene[]>> {
    const constraints = [intermineConstraint('Gene.id', '=', gene.id)];
    const query = interminePathQuery(
        interminePangeneAttributes,
        interminePangeneSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGeneResponse) => response2genes(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Gene.panGeneSets.genes.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
