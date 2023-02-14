import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLQTLStudy,
  IntermineQTLStudyResponse,
  intermineQTLStudyAttributes,
  intermineQTLStudySort,
  response2qtlStudies,
} from '../models/index.js';


// get a QTLStudy by ID
export async function getQTLStudy(id: number): Promise<GraphQLQTLStudy> {
    const constraints = [intermineConstraint('QTLStudy.id', '=', id)];
    const query = interminePathQuery(
        intermineQTLStudyAttributes,
        intermineQTLStudySort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineQTLStudyResponse) => response2qtlStudies(response))
        .then((qtlStudies: GraphQLQTLStudy[]) => {
            if (!qtlStudies.length) {
                const msg = `QTLStudy with ID '${id}' not found`;
                this.inputError(msg);
            }
            return qtlStudies[0];
        });
}