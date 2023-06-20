import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
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
export async function getStrains({organism, start, size}: GetStrainsOptions):
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
    const dataPromise = this.pathQuery(query, {start, size})
        .then((response: IntermineStrainResponse) => response2strains(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Strain.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, start, size));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
