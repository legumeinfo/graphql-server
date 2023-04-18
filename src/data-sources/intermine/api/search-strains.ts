import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
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
} & PaginationOptions;


// path query search for Strain by description and/or origin
export async function searchStrains(
    {
        description,
        origin,
        start,
        size,
    }: SearchStrainsOptions,
): Promise<GraphQLStrain[]> {
    const constraints = [];
    if (description) {
        const constraint = intermineConstraint('Strain.description', 'CONTAINS', description);
        constraints.push(constraint);
    }
    if (origin) {
        const constraint = intermineConstraint('Strain.origin', 'CONTAINS', origin);
        constraints.push(constraint);
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
