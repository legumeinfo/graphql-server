import { intermineConstraint, intermineNotNullConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLOrganism,
  IntermineOrganismResponse,
  intermineOrganismAttributes,
  intermineOrganismSort,
  response2organisms,
} from '../models/index.js';
import { PaginationOptions, defaultPaginationOptions } from './pagination.js';


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
    start=defaultPaginationOptions.start,
    size=defaultPaginationOptions.size,
  }: SearchOrganismsOptions,
): Promise<GraphQLOrganism[]> {
    const constraints = [];
    // some organisms have null genus because they are family imports, we don't want them.
    constraints.push(intermineNotNullConstraint('Organism.genus'));
    if (taxonId) {
        constraints.push(intermineConstraint('Organism.taxonId', '=', taxonId));
    }
    if (abbreviation) {
        constraints.push(intermineConstraint('Organism.abbreviation', '=', abbreviation));
    }
    if (name) {
        constraints.push(intermineConstraint('Organism.name', '=',  name));
    }
    if (genus) {
        constraints.push(intermineConstraint('Organism.genus', '=', genus));
    }
    if (species) {
        constraints.push(intermineConstraint('Organism.species', '=', species));
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
