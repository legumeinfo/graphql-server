import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
    GraphQLTrait,
    IntermineTraitResponse,
    intermineTraitAttributes,
    intermineTraitSort,
    response2traits,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type SearchTraitsOptions = {
    name?: string;
} & PaginationOptions;


// path query search for Traits by name
// NOTE: description is typically empty, as it describes the methods used to measure the trait.
export async function searchTraits(
    {
        name,
        start,
        size,
    }: SearchTraitsOptions,
): Promise<GraphQLTrait[]> {
    const constraints = [];
    if (name) {
        const nameConstraint = intermineConstraint('Trait.name', 'CONTAINS', name);
        constraints.push(nameConstraint);
    }
    const query = interminePathQuery(
        intermineTraitAttributes,
        intermineTraitSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: IntermineTraitResponse) => response2traits(response));
}
