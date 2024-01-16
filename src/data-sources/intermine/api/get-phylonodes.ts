import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
    response2graphqlPageInfo,
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

// get Phylonodes for a Phylotree or children of a parent Phylonode
export async function getPhylonodes(
    {
        phylotree,
        parent,
        page,
        pageSize,
    }: GetPhylonodesOptions,
): Promise<ApiResponse<GraphQLPhylonode[]>> {
    const constraints = [];
    const joins = [];
    if (phylotree) {
        constraints.push(intermineConstraint('Phylonode.tree.primaryIdentifier', '=', phylotree.identifier));
        // parent could be null
        joins.push(intermineJoin('Phylonode.parent', 'OUTER'));
    } else if (parent) {
        constraints.push(intermineConstraint('Phylonode.parent.identifier', '=', parent.identifier));
    }
    // protein could be null
    joins.push(intermineJoin('Phylonode.protein', 'OUTER'));
    const query = interminePathQuery(
        interminePhylonodeAttributes,
        interminePhylonodeSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: InterminePhylonodeResponse) => response2phylonodes(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Phylonode.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
