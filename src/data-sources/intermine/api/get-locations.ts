import {
    ApiResponse,
    intermineConstraint,
    interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLLocation,
  IntermineLocationResponse,
  intermineLocationAttributes,
  intermineLocationQueryFormat,
  intermineLocationSort,
  response2locations,
} from '../models/index.js';

// get Locations using the given query and returns the expected GraphQL types
async function getLocations(pathQuery: string): Promise<ApiResponse<GraphQLLocation>> {
    // get the data
    return this.pathQuery(pathQuery, {}, intermineLocationQueryFormat)
        .then((response: IntermineLocationResponse) => {
            const data = response2locations(response);
            return {data, metadata: {}};
        });
}

// get Locations for a BioEntity given its id
export async function getLocationsForBioEntity(identifier: string): Promise<ApiResponse<GraphQLLocation>> {
    const constraints = [ intermineConstraint('Location.feature.primaryIdentifier', '=', identifier) ];
    const query = interminePathQuery(
        intermineLocationAttributes,
        intermineLocationSort,
        constraints,
    );
    // get the data
    return getLocations.call(this, query);
}

// get locatedFeatures (Location) for a BioEntity using the Location.locatedOn reverse reference
export async function getLocatedFeaturesForBioEntity(identifier: string): Promise<ApiResponse<GraphQLLocation>> {
    const constraints = [intermineConstraint('Location.locatedOn.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        intermineLocationAttributes,
        intermineLocationSort,
        constraints,
    );
    // get the data
    return getLocations.call(this, query);
}
