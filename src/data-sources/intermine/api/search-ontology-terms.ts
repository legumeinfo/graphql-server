import {
  ApiResponse,
  IntermineCountResponse,
  intermineConstraint,
  interminePathQuery,
  countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
  GraphQLOntologyTerm,
  IntermineOntologyTermResponse,
  intermineOntologyTermAttributes,
  intermineOntologyTermSort,
  response2ontologyTerms,
} from '../models/index.js';
import {PaginationOptions} from './pagination.js';

export type SearchOntologyTermsOptions = {
  description?: string;
} & PaginationOptions;

// path query search for OntologyTerm by description
export async function searchOntologyTerms({
  description,
  page,
  pageSize,
}: SearchOntologyTermsOptions): Promise<ApiResponse<GraphQLOntologyTerm[]>> {
  const constraints = [];
  if (description) {
    const descriptionConstraint = intermineConstraint(
      'OntologyTerm.description',
      'CONTAINS',
      description,
    );
    constraints.push(descriptionConstraint);
  }
  const query = interminePathQuery(
    intermineOntologyTermAttributes,
    intermineOntologyTermSort,
    constraints,
  );
  // get the data
  const dataPromise = this.pathQuery(query, {page, pageSize}).then(
    (response: IntermineOntologyTermResponse) =>
      response2ontologyTerms(response),
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
