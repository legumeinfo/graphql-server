import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLStrain,
    IntermineStrainResponse,
    intermineStrainAttributes,
    intermineStrainSort,
    response2strains,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


// get Strains associated with an Organism
export async function getStrainsForOrganism(id: string, {page, pageSize}: PaginationOptions):
Promise<ApiResponse<GraphQLStrain[]>> {
    const constraints = [intermineConstraint('Strain.organism.id', '=', id)];
    const query = interminePathQuery(
        intermineStrainAttributes,
        intermineStrainSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineStrainResponse) => response2strains(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Strain.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
