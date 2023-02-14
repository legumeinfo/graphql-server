import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLOrganism,
  IntermineOrganismResponse,
  intermineOrganismAttributes,
  intermineOrganismSort,
  response2organisms,
} from '../models/index.js';
import { PaginationOptions, defaultPaginationOptions } from './pagination.js';


export type GetOrganismsOptions = {
  genus?: string;
  species?: string;
} & PaginationOptions;


// get Organisms belonging to a genus, species
export async function getOrganisms(
  {
    genus,
    species,
    start=defaultPaginationOptions.start,
    size=defaultPaginationOptions.size,
  }: GetOrganismsOptions,
): Promise<GraphQLOrganism[]> {
    const constraints = [];
    if (genus) {
        const genusConstraint = intermineConstraint('Organism.genus', '=', genus);
        constraints.push(genusConstraint);
    }
    if (species) {
        const speciesConstraint = intermineConstraint('Organism.species', '=', species);
        constraints.push(speciesConstraint);
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
