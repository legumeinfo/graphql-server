import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
  GraphQLOrganism,
  GraphQLStrain,
  IntermineStrainResponse,
  intermineStrainAttributes,
  intermineStrainSort,
  response2strains,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetStrainsOptions = {
  organism?: GraphQLOrganism;
} & PaginationOptions;


// get Strains associated with an Organism
export async function getStrains({organism, page, pageSize}: GetStrainsOptions):
Promise<ApiResponse<GraphQLStrain[]>> {
    const constraints = [];
    if (organism) {
        const organismConstraint = intermineConstraint('Strain.organism.id', '=', organism.id);
        constraints.push(organismConstraint);
    }
    const query = interminePathQuery(
        intermineStrainAttributes,
        intermineStrainSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineStrainResponse) => response2strains(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
