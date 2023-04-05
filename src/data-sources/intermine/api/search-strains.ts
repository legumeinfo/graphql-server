import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
    GraphQLStrain,
    IntermineStrainResponse,
    intermineStrainAttributes,
    intermineStrainSort,
    response2strains,
} from '../models/index.js';
import { PaginationOptions, defaultPaginationOptions } from './pagination.js';


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
        start=defaultPaginationOptions.start,
        size=defaultPaginationOptions.size,
    }: SearchStrainsOptions,
): Promise<GraphQLStrain[]> {
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
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: IntermineStrainResponse) => response2strains(response));
}
