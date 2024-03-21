import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGene,
    GraphQLGeneFamily,
    GraphQLProteinDomain,
    IntermineProteinDomainResponse,
    intermineProteinDomainAttributes,
    intermineProteinDomainSort,
    response2proteinDomains,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetProteinDomainsOptions = {
    gene?: GraphQLGene;
    geneFamily?: GraphQLGeneFamily;
} & PaginationOptions;


// get ProteinDomains for a Gene, GeneFamily
export async function getProteinDomains(
    {
        gene,
        geneFamily,
        page,
        pageSize,
    }: GetProteinDomainsOptions,
): Promise<ApiResponse<GraphQLProteinDomain[]>> {
    const constraints = [];
    if (gene) {
        const geneConstraint = intermineConstraint('ProteinDomain.genes.id', '=', gene.id);
        constraints.push(geneConstraint);
    }
    if (geneFamily) {
        const geneFamilyConstraint = intermineConstraint('ProteinDomain.geneFamilies.id', '=', geneFamily.id);
        constraints.push(geneFamilyConstraint);
    }
    const query = interminePathQuery(
        intermineProteinDomainAttributes,
        intermineProteinDomainSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineProteinDomainResponse) => response2proteinDomains(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
