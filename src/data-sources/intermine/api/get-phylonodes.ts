import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLPhylonode,
    GraphQLPhylotree,
    InterminePhylonodeResponse,
    interminePhylonodeAttributes,
    interminePhylonodeSort,
    response2phylonodes,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetPhylonodesOptions = {
    phylotree?: GraphQLPhylotree;
    parent?: GraphQLPhylonode;
} & PaginationOptions;


// get Phylonodes for a Phylotree or parent Phylonode
export async function getPhylonodes(
    {
        phylotree,
        parent,
        page,
        pageSize,
    }: GetPhylonodesOptions,
): Promise<ApiResponse<GraphQLPhylonode[]>> {
    const constraints = [];
    if (phylotree) {
        const phylotreeConstraint = intermineConstraint('Phylonode.tree.id', '=', phylotree.id);
        constraints.push(phylotreeConstraint);
    } else if (parent) {
        const parentConstraint = intermineConstraint('Phylonode.parent.id', '=', parent.id);
        constraints.push(parentConstraint);
    }
    const query = interminePathQuery(
        interminePhylonodeAttributes,
        interminePhylonodeSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: InterminePhylonodeResponse) => response2phylonodes(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
