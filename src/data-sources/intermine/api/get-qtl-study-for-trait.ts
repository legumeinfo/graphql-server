import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLQTLStudy,
  GraphQLTrait,
  IntermineQTLStudyResponse,
  intermineQTLStudyAttributes,
  intermineQTLStudySort,
  response2qtlStudies,
} from '../models/index.js';


// get the QTLStudy for a Trait
export async function getQTLStudyForTrait(trait: GraphQLTrait):
Promise<ApiResponse<GraphQLQTLStudy|null>> {
    const constraints = [intermineConstraint('QTLStudy.qtls.trait.id', '=', trait.id)];
    const query = interminePathQuery(
        intermineQTLStudyAttributes,
        intermineQTLStudySort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineQTLStudyResponse) => response2qtlStudies(response))
        .then((qtlStudies: Array<GraphQLQTLStudy>) => {
            if (qtlStudies.length) {
                return qtlStudies[0];
            } else {
                return null;
            }
        })
        .then((qtlStudy: GraphQLQTLStudy) => ({data: qtlStudy}));
}
