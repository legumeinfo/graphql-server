import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
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
        start,
        size,
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
    const dataPromise = this.pathQuery(query, {start, size})
        .then((response: IntermineProteinDomainResponse) => response2proteinDomains(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'ProteinDomain.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, start, size));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
