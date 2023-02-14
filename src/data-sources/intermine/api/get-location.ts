import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLLocation,
  IntermineLocationResponse,
  intermineLocationAttributes,
  intermineLocationSort,
  response2locations,
} from '../models/index.js';


// get a location by ID
export async function getLocation(id: number): Promise<GraphQLLocation> {
    const constraints = [intermineConstraint('Location.id', '=', id)];
    const query = interminePathQuery(
        intermineLocationAttributes,
        intermineLocationSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineLocationResponse) => response2locations(response))
        .then((locations: Array<GraphQLLocation>) => {
            if (!locations.length) {
                const msg = `Location with ID '${id}' not found`;
                this.inputError(msg);
            }
            return locations[0];
        });
}
