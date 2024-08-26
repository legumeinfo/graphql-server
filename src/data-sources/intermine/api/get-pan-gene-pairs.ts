import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    intermineOneOfConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLPanGenePair,
    InterminePanGenePairResponse,
    interminePanGenePairAttributes,
    interminePanGenePairSort,
    response2panGenePairs,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetPanGenePairsOptions = {
    genus?: string;
    species?: string;
    strain?: string;
    assembly?: string;
    annotation?: string;
} & PaginationOptions;


// gets Pan Genes for the given gene identifiers that meet the given constraints
export async function getPanGenePairs(
    identifiers: string[],
    {
        genus,
        species,
        strain,
        assembly,
        annotation,
        page,
        pageSize,
    }: GetPanGenePairsOptions,
): Promise<ApiResponse<GraphQLPanGenePair[]>> {
    const constraints = [
        intermineConstraint('Gene', '!=', 'Gene.panGeneSets.genes'),
        intermineOneOfConstraint('Gene.panGeneSets.genes.primaryIdentifier', identifiers),
    ];
    if (genus) {
        constraints.push(intermineConstraint('Gene.organism.genus', '=', genus));
    }
    if (species) {
        constraints.push(intermineConstraint('Gene.organism.species', '=', species));
    }
    if (strain) {
        constraints.push(intermineConstraint('Gene.strain.identifier', '=', strain));
    }
    if (assembly) {
        constraints.push(intermineConstraint('Gene.assemblyVersion', '=', assembly));
    }
    if (annotation) {
        constraints.push(intermineConstraint('Gene.annotationVersion', '=', annotation));
    }
    const query = interminePathQuery(
        interminePanGenePairAttributes,
        interminePanGenePairSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: InterminePanGenePairResponse) => response2panGenePairs(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
