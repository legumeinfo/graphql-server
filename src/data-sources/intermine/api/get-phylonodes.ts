import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLPhylonode,
  GraphQLPhylotree,
  InterminePhylonodeResponse,
  interminePhylonodeAttributes,
  interminePhylonodeSort,
  response2phylonodes,
} from '../models/index.js';
import { PaginationOptions, defaultPaginationOptions } from './pagination.js';


export type GetPhylonodesOptions = {
  phylotree?: GraphQLPhylotree;
  parent?: GraphQLPhylonode;
} & PaginationOptions;


// get Phylonodes for a Phylotree or parent Phylonode
export async function getPhylonodes(
  {
    phylotree,
    parent,
    start=defaultPaginationOptions.start,
    size=defaultPaginationOptions.size,
  }: GetPhylonodesOptions,
): Promise<GraphQLPhylonode[]> {
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
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: InterminePhylonodeResponse) => response2phylonodes(response));
}
