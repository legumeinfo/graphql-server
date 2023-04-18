import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
    GraphQLOrganism,
    IntermineOrganismResponse,
    intermineOrganismAttributes,
    intermineOrganismSort,
    response2organisms,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type SearchOrganismsOptions = {
    taxonId?: string;
    abbreviation?: string;
    name?: string;
    genus?: string;
    species?: string;
} & PaginationOptions;


/// path query search for Organism of a given taxonId, abbreviation, name, genus, and/or species
export async function searchOrganisms(
    {
        taxonId,
        abbreviation,
        name,
        genus,
        species,
        start,
        size,
    }: SearchOrganismsOptions,
): Promise<GraphQLOrganism[]> {
    const constraints = [];
    if (taxonId) {
        const constraint = intermineConstraint('Organism.taxonId', '=', taxonId);
        constraints.push(constraint);
    }
    if (abbreviation) {
        const constraint = intermineConstraint('Organism.abbreviation', '=', abbreviation);
        constraints.push(constraint);
    }
    if (name) {
        const constraint = intermineConstraint('Organism.name', '=',  name);
        constraints.push(constraint);
    }
    if (genus) {
        const constraint = intermineConstraint('Organism.genus', '=', genus);
        constraints.push(constraint);
    }
    if (species) {
        const constraint = intermineConstraint('Organism.species', '=', species);
        constraints.push(constraint);
    }
    const query = interminePathQuery(
        intermineOrganismAttributes,
        intermineOrganismSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: IntermineOrganismResponse) => response2organisms(response));
}
