import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLLocation,
  IntermineLocationResponse,
  intermineLocationAttributes,
  intermineLocationSort,
  response2locations,
} from '../models/index.js';

// get a location by ID
export async function getLocation(id: number): Promise<ApiResponse<GraphQLLocation>> {
    const constraints = [intermineConstraint('Location.id', '=', (id === null) ? 0 : id)];
    const query = interminePathQuery(
        intermineLocationAttributes,
        intermineLocationSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineLocationResponse) => response2locations(response))
        .then((locations: Array<GraphQLLocation>) => {
            if (!locations.length) return null;
            return locations[0];
        })
        .then((location: GraphQLLocation) => ({data: location}));
}

