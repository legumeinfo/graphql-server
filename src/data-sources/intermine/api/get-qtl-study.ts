import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLQTLStudy,
  IntermineQTLStudyResponse,
  intermineQTLStudyAttributes,
  intermineQTLStudySort,
  response2qtlStudies,
} from '../models/index.js';


// get a QTLStudy by identifier
export async function getQTLStudy(identifier: string):
Promise<ApiResponse<GraphQLQTLStudy>> {
    const constraints = [intermineConstraint('QTLStudy.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        intermineQTLStudyAttributes,
        intermineQTLStudySort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineQTLStudyResponse) => response2qtlStudies(response))
        .then((qtlStudies: GraphQLQTLStudy[]) => {
            if (!qtlStudies.length) return null;
            return qtlStudies[0];
        })
        .then((qtlStudy: GraphQLQTLStudy) => ({data: qtlStudy}));
}


// get the QTLStudy for a Trait
export async function getQTLStudyForTrait(traitIdentifier: string):
Promise<ApiResponse<GraphQLQTLStudy|null>> {
    const constraints = [intermineConstraint('QTLStudy.qtls.trait.primaryIdentifier', '=', traitIdentifier)];
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
