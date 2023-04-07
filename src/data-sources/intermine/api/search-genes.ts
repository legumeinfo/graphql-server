import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
    GraphQLGene,
    IntermineGeneResponse,
    intermineGeneAttributes,
    intermineGeneSort,
    response2genes,
} from '../models/index.js';
import { PaginationOptions, defaultPaginationOptions } from './pagination.js';


export type SearchGenesOptions = {
    description?: string;
    genus?: string;
    species?: string;
    strain?: string;
    identifier?: string;
    name?: string;
    geneFamilyIdentifier?: string;
} & PaginationOptions;


// path query search for Gene by description, etc.
export async function searchGenes(
    {
        description,
        genus,
        species,
        strain,
        identifier,
        name,
        geneFamilyIdentifier,
        start=defaultPaginationOptions.start,
        size=defaultPaginationOptions.size,
    }: SearchGenesOptions,
): Promise<GraphQLGene[]> {
    const constraints = [];
    if (description) {
        constraints.push(intermineConstraint('Gene.description', 'CONTAINS', description));
    }
    if (genus) {
        constraints.push(intermineConstraint('Gene.organism.genus', '=', genus));
    }
    if (species) {
        constraints.push(intermineConstraint('Gene.organism.species', '=', species));
    }
    if (strain) {
        constraints.push(intermineConstraint('Gene.strain.identifier', '=', strain));
    }
    if (identifier) {
        constraints.push(intermineConstraint('Gene.primaryIdentifier', 'CONTAINS', identifier));
    }
    if (name) {
        constraints.push(intermineConstraint('Gene.name', 'CONTAINS', name));
    }
    if (geneFamilyIdentifier) {
        constraints.push(intermineConstraint('Gene.geneFamilyAssignments.geneFamily.primaryIdentifier', 'CONTAINS', geneFamilyIdentifier));
    }
    const query = interminePathQuery(
        intermineGeneAttributes,
        intermineGeneSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: IntermineGeneResponse) => response2genes(response));
}
