import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLGeneFamilyTally,
  IntermineGeneFamilyTallyResponse,
  intermineGeneFamilyTallyAttributes,
  intermineGeneFamilyTallySort,
  response2geneFamilyTallies,
} from '../models/index.js';


// get a GeneFamilyTally by ID
export async function getGeneFamilyTally(id: number): Promise<GraphQLGeneFamilyTally> {
    const constraints = [intermineConstraint('GeneFamilyTally.id', '=', id)];
    const query = interminePathQuery(
        intermineGeneFamilyTallyAttributes,
        intermineGeneFamilyTallySort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineGeneFamilyTallyResponse) => response2geneFamilyTallies(response))
        .then((geneFamilyTallies: Array<GraphQLGeneFamilyTally>) => {
            if (!geneFamilyTallies.length) return null;
            return geneFamilyTallies[0];
        });
}
