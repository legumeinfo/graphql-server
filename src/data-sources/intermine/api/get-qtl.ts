import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLQTL,
  IntermineQTLResponse,
  intermineQTLAttributes,
  intermineQTLSort,
  response2qtls,
} from '../models/index.js';


// get a QTL by ID
export async function getQTL(id: number): Promise<GraphQLQTL> {
    const constraints = [intermineConstraint('QTL.id', '=', id)];
    const query = interminePathQuery(
        intermineQTLAttributes,
        intermineQTLSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineQTLResponse) => response2qtls(response))
        .then((qtls: Array<GraphQLQTL>) => {
            if (!qtls.length) return null;
            return qtls[0];
        });
}
