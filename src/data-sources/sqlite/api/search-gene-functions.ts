import {SqliteServer, ApiResponse} from '../sqlite.server.js';
import type {Constraint} from '../path-resolver.js';
import {
  GraphQLGeneFunction,
  intermineGeneFunctionAttributes,
  intermineGeneFunctionSort,
  response2genefunctions,
} from '../../intermine/models/index.js';
import {PaginationOptions} from '../../intermine/api/pagination.js';

export type SearchGeneFunctionsOptions = {
  trait?: string;
  gene?: string;
  genus?: string;
  species?: string;
  publicationId?: string;
  author?: string;
} & Partial<PaginationOptions>;

// Faithful SQLite port of intermine/api/search-gene-functions.ts, including the
// LOOKUP constraints (gene identifier / synonym resolution) and the constraint
// logic string that OR-combines the gene-match constraints.
export async function searchGeneFunctions(
  this: SqliteServer,
  {
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
  const constraints: Constraint[] = [];
  const logic: string[] = [];

  if (trait) {
    constraints.push({
      path: 'GeneFunction.trait.name',
      op: 'CONTAINS',
      value: trait,
      code: 'A',
    });
    logic.push('A');
  }
  if (gene) {
    constraints.push({
      path: 'GeneFunction.gene.panGeneSets.genes',
      op: 'LOOKUP',
      value: gene,
      code: 'L',
    });
    constraints.push({
      path: 'GeneFunction.gene',
      op: 'LOOKUP',
      value: gene,
      code: 'B',
    });
    constraints.push({
      path: 'GeneFunction.classicalLocus',
      op: 'CONTAINS',
      value: gene,
      code: 'C',
    });
    constraints.push({
      path: 'GeneFunction.symbol',
      op: 'CONTAINS',
      value: gene,
      code: 'D',
    });
    constraints.push({
      path: 'GeneFunction.symbolLong',
      op: 'CONTAINS',
      value: gene,
      code: 'E',
    });
    constraints.push({
      path: 'GeneFunction.gene.synonyms.value',
      op: 'CONTAINS',
      value: gene,
      code: 'F',
    });
    constraints.push({
      path: 'GeneFunction.pubName',
      op: 'CONTAINS',
      value: gene,
      code: 'K',
    });
    logic.push('(L OR B OR C OR D OR E OR F OR K)');
  }
  if (genus) {
    constraints.push({
      path: 'GeneFunction.gene.organism.genus',
      op: '=',
      value: genus,
      code: 'G',
    });
    logic.push('G');
  }
  if (species) {
    constraints.push({
      path: 'GeneFunction.gene.organism.species',
      op: '=',
      value: species,
      code: 'H',
    });
    logic.push('H');
  }
  if (publicationId) {
    const path = publicationId.includes('/')
      ? 'GeneFunction.publications.doi'
      : 'GeneFunction.publications.pubMedId';
    constraints.push({path, op: '=', value: publicationId, code: 'I'});
    logic.push('I');
  }
  if (author) {
    constraints.push({
      path: 'GeneFunction.publications.authors.name',
      op: 'CONTAINS',
      value: author,
      code: 'J',
    });
    logic.push('J');
  }

  const constraintLogic = logic.join(' AND ');
  const response = this.pathQuery(
    'GeneFunction',
    intermineGeneFunctionAttributes,
    intermineGeneFunctionSort,
    constraints,
    constraintLogic,
    {page, pageSize},
  );
  const {count} = this.pathQueryCount(
    'GeneFunction',
    constraints,
    constraintLogic,
  );
  const ps = pageSize ?? 10;
  return {
    data: response2genefunctions(response as any),
    metadata: {
      pageInfo: {
        numResults: count,
        pageSize: ps,
        hasNextPage: (page ?? 1) * ps < count,
      },
    },
  };
}
