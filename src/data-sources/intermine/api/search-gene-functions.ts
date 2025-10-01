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
    publicationId?: string;
    author?: string;
} & PaginationOptions;


// path query search for GeneFunction by synopsis, etc.
export async function searchGeneFunctions(
    {
    //synopsis,
    //symbol,
    trait,
    gene,
    genus,
    species,
    publicationId,
    author,
    page,
    pageSize,
    }: SearchGeneFunctionsOptions,
): Promise<ApiResponse<GraphQLGeneFunction[]>> {
    const constraints = [];
    const constraintLogic = [];
    // These are unused on gene function search frontend
    //if (synopsis) {
    //    const synopsisConstraint = intermineConstraint('GeneFunction.synopsis', 'CONTAINS', synopsis);
    //    constraints.push(synopsisConstraint);
    //}
    //if (symbol) {
    //    const symbolConstraint = intermineConstraint('GeneFunction.symbol', '=', symbol);
    //    constraints.push(symbolConstraint);
    //}
    if (trait) {
        const traitConstraint = intermineConstraint('GeneFunction.trait.name', 'CONTAINS', trait, 'A');
        constraints.push(traitConstraint);
        constraintLogic.push('A')
    }
    if (gene) {
        const geneConstraint = intermineConstraint('GeneFunction.gene.primaryIdentifier', 'CONTAINS', gene, 'B');
        const classicalLocusConstraint = intermineConstraint('GeneFunction.classicalLocus', 'CONTAINS', gene, 'C');
        const symbolConstraint = intermineConstraint('GeneFunction.symbol', 'CONTAINS', gene, 'D');
        const symbolLongConstraint = intermineConstraint('GeneFunction.symbolLong', 'CONTAINS', gene, 'E');
        const synonymsConstraint = intermineConstraint('GeneFunction.gene.synonyms.value', 'CONTAINS', gene, 'F');
        const pubNameConstraint = intermineConstraint('GeneFunction.pubName', 'CONTAINS', gene, 'K');
        constraints.push(geneConstraint);
        constraints.push(classicalLocusConstraint);
        constraints.push(symbolConstraint);
        constraints.push(symbolLongConstraint);
        constraints.push(synonymsConstraint);
        constraints.push(pubNameConstraint);
        constraintLogic.push('(B OR C OR D OR E OR F OR K)')
    }
    if (genus) {
        const genusConstraint = intermineConstraint('GeneFunction.gene.organism.genus', '=', genus, 'G');
        constraints.push(genusConstraint);
        constraintLogic.push('G')
    }
    if (species) {
        const speciesConstraint = intermineConstraint('GeneFunction.gene.organism.species', '=', species, 'H');
        constraints.push(speciesConstraint);
        constraintLogic.push('H')
    }
    if (publicationId) {
      if (publicationId.includes('/')) {
        // DOI contains /, like 10.1007/s00122-006-0217-2
        const constraint = intermineConstraint(
          'GeneFunction.publications.doi',
          '=',
          publicationId,
          'I'
        );
        constraints.push(constraint);
      } else {
        // assume PMID if not DOI
        const constraint = intermineConstraint(
          'GeneFunction.publications.pubMedId',
          '=',
          publicationId,
          'I'
        );
        constraints.push(constraint);
      }
      constraintLogic.push('I')
    }
    if (author) {
      const constraint = intermineConstraint(
        'GeneFunction.publications.authors.name',
        'CONTAINS',
        author,
        'J'
      );
      constraints.push(constraint);
      constraintLogic.push('J')
    }
    const query = interminePathQuery(
        intermineGeneFunctionAttributes,
        intermineGeneFunctionSort,
        constraints,
        [],
        constraintLogic.join(' AND ')
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
