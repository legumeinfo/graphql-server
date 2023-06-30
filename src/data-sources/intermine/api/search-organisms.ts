import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    intermineNotNullConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
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
): Promise<ApiResponse<GraphQLOrganism[]>> {
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
    // get the data
    const dataPromise = this.pathQuery(query, {start, size})
        .then((response: IntermineOrganismResponse) => response2organisms(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Organism.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, start, size));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
