import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGene,
    GraphQLPathway,
    InterminePathwayResponse,
    interminePathwayAttributes,
    interminePathwaySort,
    response2pathways,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetPathwaysOptions = {
    gene?: GraphQLGene;
} & PaginationOptions;


// get Pathways associated with a Gene
export async function getPathways(
    {
        gene,
        page,
        pageSize,
    }: GetPathwaysOptions,
): Promise<ApiResponse<GraphQLPathway[]>> {
    const constraints = [];
    if (gene) {
        const constraint = intermineConstraint('Pathway.genes.id', '=', gene.id);
        constraints.push(constraint);
    }
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
