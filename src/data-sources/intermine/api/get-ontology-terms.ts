import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
  GraphQLOntologyTerm,
  GraphQLTrait,
  IntermineOntologyTermResponse,
  intermineOntologyTermAttributes,
  intermineOntologyTermSort,
  response2ontologyTerms,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetOntologyTermsOptions = {
  trait?: GraphQLTrait;
} & PaginationOptions;


// get OntologyTerms for a Trait
export async function getOntologyTerms(
    {trait, page, pageSize}: GetOntologyTermsOptions,
): Promise<ApiResponse<GraphQLOntologyTerm[]>> {
    const constraints = [];
    if (trait) {
        const traitConstraint = intermineConstraint('Trait.id', '=', trait.id);
        constraints.push(traitConstraint);
    }
    const query = interminePathQuery(
        intermineOntologyTermAttributes,
        intermineOntologyTermSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
      .then((response: IntermineOntologyTermResponse) => response2ontologyTerms(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
