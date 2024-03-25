import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGene,
    GraphQLPanGeneSet,
    GraphQLMRNA,
    IntermineMRNAResponse,
    intermineMRNAAttributes,
    intermineMRNASort,
    response2mRNAs,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetMRNAsOptions = {
    gene?: GraphQLGene;
    panGeneSet?: GraphQLPanGeneSet;
} & PaginationOptions;


// Get mRNAs associated with a Gene or PanGeneSet.
export async function getMRNAs(
    {
        gene,
        panGeneSet,
        page,
        pageSize,
    }: GetMRNAsOptions,
): Promise<ApiResponse<GraphQLMRNA[]>> {
    const constraints = [];
    if (gene) {
        constraints.push(intermineConstraint('MRNA.gene.id', '=', gene.id));
    }
    if (panGeneSet) {
        constraints.push(intermineConstraint('MRNA.panGeneSets.id', '=', panGeneSet.id));
    }
    const query = interminePathQuery(
        intermineMRNAAttributes,
        intermineMRNASort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineMRNAResponse) => response2mRNAs(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'MRNA.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
