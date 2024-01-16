import {
    ApiResponse,
    intermineConstraint,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLNewick,
    GraphQLPhylotree,
    IntermineNewickResponse,
    intermineNewickAttributes,
    intermineNewickSort,
    response2newicks,
} from '../models/index.js';

// get a Newick string for a given Phylotree (Newick.identifier = Phylotree.identifier)
export async function getNewick(phylotree: GraphQLPhylotree):
Promise<ApiResponse<GraphQLNewick>> {
    const constraints = [intermineConstraint('Newick.identifier', '=', phylotree.identifier)];
    const query = interminePathQuery(
        intermineNewickAttributes,
        intermineNewickSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineNewickResponse) => response2newicks(response))
        .then((newicks: Array<GraphQLNewick>) => {
            if (!newicks.length) return null;
            return newicks[0];
        })
        .then((newick: GraphQLNewick) => ({data: newick}));
}
