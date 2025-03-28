import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLPathway,
    InterminePathwayResponse,
    interminePathwayAttributes,
    interminePathwaySort,
    response2pathways,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// get Pathways associated with a Gene
export async function getPathwaysForGene(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLPathway>> {
    const constraints = [intermineConstraint('Pathway.genes.id', '=', id)];
    const query = interminePathQuery(
        interminePathwayAttributes,
        interminePathwaySort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: InterminePathwayResponse) => response2pathways(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
