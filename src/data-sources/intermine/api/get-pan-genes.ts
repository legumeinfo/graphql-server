import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    intermineNoneOfConstraint,
    intermineOneOfConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGene,
    IntermineGeneResponse,
    intermineGeneAttributes,
    intermineGeneSort,
    response2genes,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetPanGenesOptions = {
    genus?: string;
    species?: string;
    strain?: string;
    assembly?: string;
    annotation?: string;
} & PaginationOptions;


// gets Pan Genes for the given gene identifiers that meet the given constraints
export async function getPanGenes(
    identifiers: string[],
    {
        genus,
        species,
        strain,
        assembly,
        annotation,
        page,
        pageSize,
    }: GetPanGenesOptions,
): Promise<ApiResponse<GraphQLGene[]>> {
    const constraints = [
        intermineNoneOfConstraint('Gene.primaryIdentifier', identifiers),
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
        intermineGeneAttributes,
        intermineGeneSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGeneResponse) => response2genes(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
