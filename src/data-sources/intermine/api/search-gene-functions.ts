import {
  ApiResponse,
  IntermineCountResponse,
  IntermineDataResponse,
  intermineConstraint,
  intermineOneOfConstraint,
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
import {PaginationOptions} from './pagination.js';

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
export async function searchGeneFunctions({
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
}: SearchGeneFunctionsOptions): Promise<ApiResponse<GraphQLGeneFunction[]>> {
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
    const traitConstraint = intermineConstraint(
      'GeneFunction.trait.name',
      'CONTAINS',
      trait,
      'A',
    );
    constraints.push(traitConstraint);
    constraintLogic.push('A');
  }
  if (gene) {
    // Constraints on collections reached through the gene (pan-gene sets,
    // synonyms) can't be OR'd with the other gene constraints directly:
    // InterMine inner joins every path, so a GeneFunction whose gene lacks the
    // collection (e.g. a gene in no pan-gene set) is dropped before the OR is
    // evaluated, and InterMine rejects OR logic across outer joins. Instead,
    // resolve each collection constraint to GeneFunction IDs in its own query
    // and OR a single ONE OF constraint on those IDs.
    const collectionConstraints = [
      intermineConstraint(
        'GeneFunction.gene.panGeneSets.genes',
        'LOOKUP',
        gene,
      ),
      intermineConstraint('GeneFunction.gene.synonyms.value', 'CONTAINS', gene),
    ];
    const idPromises = collectionConstraints.map((constraint) => {
      const idQuery = interminePathQuery(['GeneFunction.id'], '', [constraint]);
      return this.pathQuery(idQuery).then(
        (response: IntermineDataResponse<[number]>) =>
          response.results.map(([id]) => id),
      );
    });
    const ids = [...new Set((await Promise.all(idPromises)).flat())];
    const geneConstraint = intermineConstraint(
      'GeneFunction.gene',
      'LOOKUP',
      gene,
      'B',
    );
    const classicalLocusConstraint = intermineConstraint(
      'GeneFunction.classicalLocus',
      'CONTAINS',
      gene,
      'C',
    );
    const symbolConstraint = intermineConstraint(
      'GeneFunction.symbol',
      'CONTAINS',
      gene,
      'D',
    );
    const symbolLongConstraint = intermineConstraint(
      'GeneFunction.symbolLong',
      'CONTAINS',
      gene,
      'E',
    );
    const pubNameConstraint = intermineConstraint(
      'GeneFunction.pubName',
      'CONTAINS',
      gene,
      'K',
    );
    constraints.push(geneConstraint);
    constraints.push(classicalLocusConstraint);
    constraints.push(symbolConstraint);
    constraints.push(symbolLongConstraint);
    constraints.push(pubNameConstraint);
    const geneCodes = ['B', 'C', 'D', 'E', 'K'];
    if (ids.length) {
      const idsConstraint = intermineOneOfConstraint(
        'GeneFunction.id',
        ids,
        'L',
      );
      constraints.push(idsConstraint);
      geneCodes.push('L');
    }
    constraintLogic.push(`(${geneCodes.join(' OR ')})`);
  }
  if (genus) {
    const genusConstraint = intermineConstraint(
      'GeneFunction.gene.organism.genus',
      '=',
      genus,
      'G',
    );
    constraints.push(genusConstraint);
    constraintLogic.push('G');
  }
  if (species) {
    const speciesConstraint = intermineConstraint(
      'GeneFunction.gene.organism.species',
      '=',
      species,
      'H',
    );
    constraints.push(speciesConstraint);
    constraintLogic.push('H');
  }
  if (publicationId) {
    if (publicationId.includes('/')) {
      // DOI contains /, like 10.1007/s00122-006-0217-2
      const constraint = intermineConstraint(
        'GeneFunction.publications.doi',
        '=',
        publicationId,
        'I',
      );
      constraints.push(constraint);
    } else {
      // assume PMID if not DOI
      const constraint = intermineConstraint(
        'GeneFunction.publications.pubMedId',
        '=',
        publicationId,
        'I',
      );
      constraints.push(constraint);
    }
    constraintLogic.push('I');
  }
  if (author) {
    const constraint = intermineConstraint(
      'GeneFunction.publications.authors.name',
      'CONTAINS',
      author,
      'J',
    );
    constraints.push(constraint);
    constraintLogic.push('J');
  }
  const query = interminePathQuery(
    intermineGeneFunctionAttributes,
    intermineGeneFunctionSort,
    constraints,
    [],
    constraintLogic.join(' AND '),
  );
  // get the data
  const dataPromise = this.pathQuery(query, {page, pageSize}).then(
    (response: IntermineGeneFunctionResponse) =>
      response2genefunctions(response),
  );
  // get a summary of the data and convert it to page info
  const pageInfoPromise = this.pathQueryCount(query).then(
    (response: IntermineCountResponse) =>
      countResponse2graphqlPageInfo(response, page, pageSize),
  );
  // return the expected GraphQL type
  return Promise.all([dataPromise, pageInfoPromise]).then(
    ([data, pageInfo]) => ({data, metadata: {pageInfo}}),
  );
}
