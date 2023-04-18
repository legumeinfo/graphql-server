import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
    GraphQLGWAS,
    IntermineGWASResponse,
    intermineGWASAttributes,
    intermineGWASSort,
    response2gwas,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type SearchGWASesOptions = {
    description?: string;
} & PaginationOptions;


// path query search for GWAS by description
export async function searchGWASes(
    {
        description,
        start,
        size,
    }: SearchGWASesOptions,
): Promise<GraphQLGWAS[]> {
    const constraints = [];
    if (description) {
        const descriptionConstraint = intermineConstraint('GWAS.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = interminePathQuery(
        intermineGWASAttributes,
        intermineGWASSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: IntermineGWASResponse) => response2gwas(response));
}
