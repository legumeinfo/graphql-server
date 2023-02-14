import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLLocation,
  GraphQLSequenceFeature,
  IntermineLocationResponse,
  intermineLocationAttributes,
  intermineLocationSort,
  response2locations,
} from '../models/index.js';


export type GetLocationsOptions = {
  sequenceFeature?: GraphQLSequenceFeature;
}


// get Locations for any type that extends SequenceFeature
export async function getLocations({sequenceFeature}: GetLocationsOptions)
: Promise<GraphQLLocation> {
    const constraints = [];
    if (sequenceFeature) {
        const constraint = intermineConstraint('Location.feature.id', '=', sequenceFeature.id);
        constraints.push(constraint);
    }
    const query = interminePathQuery(
        intermineLocationAttributes,
        intermineLocationSort,
        constraints,
    );
    return this.pathQuery(query)
      .then((response: IntermineLocationResponse) => response2locations(response));
}
