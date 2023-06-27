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


export type SearchStrainsOptions = {
    description?: string;
    origin?: string;
    species?: string;
} & PaginationOptions;


// path query search for Strain by description and/or origin
export async function searchStrains(
    {
        description,
        origin,
        species,
        page,
        pageSize,
    }: SearchStrainsOptions,
): Promise<ApiResponse<GraphQLStrain[]>> {
    const constraints = [];
    if (description) {
        constraints.push(intermineConstraint('Strain.description', 'CONTAINS', description));
    }
    if (origin) {
        constraints.push(intermineConstraint('Strain.origin', 'CONTAINS', origin));
    }
    if (species) {
        constraints.push(intermineConstraint('Strain.organism.species', '=', species));
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
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Strain.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
