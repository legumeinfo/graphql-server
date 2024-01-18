import {
    ApiResponse,
    intermineConstraint,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLSyntenyBlock,
    IntermineSyntenyBlockResponse,
    intermineSyntenyBlockAttributes,
    intermineSyntenyBlockSort,
    response2syntenyBlocks,
} from '../models/index.js';

// get a SyntenyBlock by ID
export async function getSyntenyBlock(id: number):
Promise<ApiResponse<GraphQLSyntenyBlock>> {
    const constraints = [intermineConstraint('SyntenyBlock.id', '=', id)];
    const query = interminePathQuery(
        intermineSyntenyBlockAttributes,
        intermineSyntenyBlockSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineSyntenyBlockResponse) => response2syntenyBlocks(response))
        .then((syntenyBlocks: Array<GraphQLSyntenyBlock>) => {
            if (!syntenyBlocks.length) return null;
            return syntenyBlocks[0];
        })
        .then((syntenyBlock: GraphQLSyntenyBlock) => ({data: syntenyBlock}));
}
