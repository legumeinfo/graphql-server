import {
    ApiResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLPhylonode,
    InterminePhylonodeResponse,
    interminePhylonodeAttributes,
    interminePhylonodeSort,
    response2phylonodes,
} from '../models/index.js';

// get a Phylonode by identifier
export async function getPhylonode(identifier: string):
Promise<ApiResponse<GraphQLPhylonode>> {
    const constraints = [intermineConstraint('Phylonode.identifier', '=', identifier)];
    // protein and/or parent can be null
    const joins = [
        intermineJoin('Phylonode.protein', 'OUTER'),
        intermineJoin('Phylonode.parent', 'OUTER')
    ];
    const query = interminePathQuery(
        interminePhylonodeAttributes,
        interminePhylonodeSort,
        constraints,
        joins,
    );
    return this.pathQuery(query)
        .then((response: InterminePhylonodeResponse) => response2phylonodes(response))
        .then((phylonodes: Array<GraphQLPhylonode>) => {
            if (!phylonodes.length) return null;
            return phylonodes[0];
        })
        .then((phylonode: GraphQLPhylonode) => ({data: phylonode}));
}
