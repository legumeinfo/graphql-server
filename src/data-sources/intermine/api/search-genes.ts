import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
    GraphQLGene,
    IntermineGeneResponse,
    intermineGeneAttributes,
    intermineGeneSort,
    response2genes,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type SearchGenesOptions = {
    description?: string;
} & PaginationOptions;


// path query search for Gene by description
export async function searchGenes(
    {
        description,
        start,
        size,
    }: SearchGenesOptions,
): Promise<GraphQLGene[]> {
    const constraints = [];
    if (description) {
        const descriptionConstraint = intermineConstraint('Gene.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
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
