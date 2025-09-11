import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGeneFunction,
    IntermineGeneFunctionResponse,
    intermineGeneFunctionAttributes,
    intermineGeneFunctionSort,
    response2genefunctions,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type SearchGeneFunctionsOptions = {
    synopsis?: string;
    symbol?: string;
    trait?: string;
    gene?: string;
    genus?: string;
    species?: string;
} & PaginationOptions;


// path query search for GeneFunction by synopsis, etc.
export async function searchGeneFunctions(
    {
        synopsis,
	symbol,
	trait,
	gene,
	genus,
	species,
        page,
        pageSize,
    }: SearchGeneFunctionsOptions,
): Promise<ApiResponse<GraphQLGeneFunction[]>> {
    const constraints = [];
    if (synopsis) {
        const synopsisConstraint = intermineConstraint('GeneFunction.synopsis', 'CONTAINS', synopsis);
        constraints.push(synopsisConstraint);
    }
    if (symbol) {
        const symbolConstraint = intermineConstraint('GeneFunction.symbol', '=', symbol);
        constraints.push(symbolConstraint);
    }
    if (trait) {
        const traitConstraint = intermineConstraint('GeneFunction.trait.name', 'CONTAINS', trait);
        constraints.push(traitConstraint);
    }
    if (gene) {
        const geneConstraint = intermineConstraint('GeneFunction.gene.primaryIdentifier', 'CONTAINS', gene);
        constraints.push(geneConstraint);
    }
    if (genus) {
        const genusConstraint = intermineConstraint('GeneFunction.gene.organism.genus', '=', genus);
        constraints.push(genusConstraint);
    }
    if (species) {
        const speciesConstraint = intermineConstraint('GeneFunction.gene.organism.species', '=', species);
        constraints.push(speciesConstraint);
    }
    const query = interminePathQuery(
        intermineGeneFunctionAttributes,
        intermineGeneFunctionSort,
        constraints,
    );
    console.log("query: " + query);
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGeneFunctionResponse) => response2genefunctions(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
