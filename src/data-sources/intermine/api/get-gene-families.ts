import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
    GraphQLGeneFamily,
    GraphQLProteinDomain,
    IntermineGeneFamilyResponse,
    intermineGeneFamilyAttributes,
    intermineGeneFamilySort,
    response2geneFamilies,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GeneGeneFamiliesOptions = {
    proteinDomain?: GraphQLProteinDomain;
} & PaginationOptions;


// get GeneFamilies for a ProteinDomain
export async function getGeneFamilies(
    {
        proteinDomain,
        start,
        size,
    }: GeneGeneFamiliesOptions,
): Promise<GraphQLGeneFamily[]> {
    const constraints = [];
    if (proteinDomain) {
        const proteinDomainConstraint = intermineConstraint('GeneFamily.proteinDomains.id', '=', proteinDomain.id);
        constraints.push(proteinDomainConstraint);
    }
    const query = interminePathQuery(
        intermineGeneFamilyAttributes,
        intermineGeneFamilySort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: IntermineGeneFamilyResponse) => response2geneFamilies(response));
}
