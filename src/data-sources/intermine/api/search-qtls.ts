import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLQTL,
  IntermineQTLResponse,
  intermineQTLAttributes,
  intermineQTLSort,
  response2qtls,
} from '../models/index.js';
import { PaginationOptions, defaultPaginationOptions } from './pagination.js';


export type SearchQTLsOptions = {
  traitName?: string;
} & PaginationOptions;


// path query search for QTLs by Trait.name
export async function searchQTLs(
  {
    traitName,
    start=defaultPaginationOptions.start,
    size=defaultPaginationOptions.size,
  }: SearchQTLsOptions,
): Promise<GraphQLQTL[]> {
    const constraints = [];
    if (traitName) {
        const constraint = intermineConstraint('QTL.trait.name', 'CONTAINS', traitName);
        constraints.push(constraint);
    }
    const query = interminePathQuery(
        intermineQTLAttributes,
        intermineQTLSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: IntermineQTLResponse) => response2qtls(response));
}
