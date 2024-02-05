import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLProtein,
    IntermineProteinResponse,
    intermineProteinAttributes,
    intermineProteinSort,
    response2proteins,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// get Proteins associated with a Gene
export async function getProteinsForGene(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLProtein>> {
    const constraints = [intermineConstraint('Protein.genes.id', '=', id)];
    // all BioEntity-extending object queries must include these joins
    const joins = [
        intermineJoin('Protein.organism', 'OUTER'),
        intermineJoin('Protein.strain', 'OUTER')
    ];
    // phylonode may be null
    joins.push(intermineJoin('Protein.phylonode', 'OUTER'));
    const query = interminePathQuery(
        intermineProteinAttributes,
        intermineProteinSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineProteinResponse) => response2proteins(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Protein.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get Proteins associated with a GeneFamily
export async function getProteinsForGeneFamily(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLProtein>> {
    const constraints = [intermineConstraint('Protein.geneFamilyAssignments.geneFamily.id', '=', id)];
    // all BioEntity-extending object queries must include these joins
    const joins = [
        intermineJoin('Protein.organism', 'OUTER'),
        intermineJoin('Protein.strain', 'OUTER')
    ];
    // phylonode may be null
    joins.push(intermineJoin('Protein.phylonode', 'OUTER'));
    const query = interminePathQuery(
        intermineProteinAttributes,
        intermineProteinSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineProteinResponse) => response2proteins(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Protein.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get Proteins associated with a PanGeneSet
export async function getProteinsForPanGeneSet(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLProtein>> {
    const constraints = [intermineConstraint('Protein.panGeneSets.id', '=', panGeneSet.id)];
    // all BioEntity-extending object queries must include these joins
    const joins = [
        intermineJoin('Protein.organism', 'OUTER'),
        intermineJoin('Protein.strain', 'OUTER')
    ];
    // phylonode may be null
    joins.push(intermineJoin('Protein.phylonode', 'OUTER'));
    const query = interminePathQuery(
        intermineProteinAttributes,
        intermineProteinSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineProteinResponse) => response2proteins(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Protein.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
