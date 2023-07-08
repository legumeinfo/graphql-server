import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLGenotypingPlatform,
  IntermineGenotypingPlatformResponse,
  intermineGenotypingPlatformAttributes,
  intermineGenotypingPlatformSort,
  response2genotypingPlatforms,
} from '../models/index.js';

// get a GenotypingPlatform by primaryIdentifier
export async function getGenotypingPlatform(identifier: string):
Promise<ApiResponse<GraphQLGenotypingPlatform>> {
    const constraints = [intermineConstraint('GenotypingPlatform.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        intermineGenotypingPlatformAttributes,
        intermineGenotypingPlatformSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineGenotypingPlatformResponse) => response2genotypingPlatforms(response))
        .then((genotypingPlatforms: Array<GraphQLGenotypingPlatform>) => {
            if (!genotypingPlatforms.length) return null;
            return genotypingPlatforms[0];
        })
        .then((genotypingPlatform: GraphQLGenotypingPlatform) => ({data: genotypingPlatform}));
}
