import {
  ApiResponse,
  IntermineCountResponse,
  intermineConstraint,
  intermineNotNullConstraint,
  interminePathQuery,
  countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
  GraphQLTrait,
  IntermineTraitBaseResponse,
  IntermineTraitResponse,
  intermineTraitAttributes,
  intermineTraitBaseAttributes,
  intermineTraitSort,
  response2traits,
  response2traitsBase,
} from '../models/index.js';
import {PaginationOptions} from './pagination.js';
import {traitJoinFactory} from './trait.js';

export type SearchTraitsOptions = {
  name?: string;
  genus?: string;
  species?: string;
  studyType?: string;
  publicationId: string;
  author?: string;
} & PaginationOptions;

// Path query search for Traits by name, genus, species, study type (GWAS or QTLStudy), publication (DOI or PMID), and author.
// NOTE: Trait.description is typically empty, as it describes the methods used to measure the trait, which are often not available.
export async function searchTraits({
  name,
  genus,
  species,
  studyType,
  publicationId,
  author,
  page,
  pageSize,
}: SearchTraitsOptions): Promise<ApiResponse<GraphQLTrait[]>> {
  const constraints = [];
  let constraintLogic = '';
  if (name) {
    const constraint = intermineConstraint('Trait.name', 'CONTAINS', name);
    constraints.push(constraint);
  }
  if (genus) {
    const constraint = intermineConstraint('Trait.organism.genus', '=', genus);
    constraints.push(constraint);
  }
  if (species) {
    const constraint = intermineConstraint(
      'Trait.organism.species',
      '=',
      species,
    );
    constraints.push(constraint);
  }
  // Track whether we're using OR logic on gwas (incompatible with OUTER join)
  let hasGwasOrConstraint = false;
  if (studyType == 'GWAS') {
    const constraint = intermineNotNullConstraint('Trait.gwas');
    constraints.push(constraint);
  } else if (studyType == 'QTLStudy') {
    // any QTLStudy trait
    const constraint = intermineNotNullConstraint('Trait.qtlStudy');
    constraints.push(constraint);
  } else if (!studyType) {
    // when no study type is specified, require traits to have at least one study (GWAS or QTLStudy)
    // this ensures trait association searches only return traits with associations
    const gwasConstraint = intermineNotNullConstraint('Trait.gwas', 'A');
    const qtlStudyConstraint = intermineNotNullConstraint(
      'Trait.qtlStudy',
      'B',
    );
    constraints.push(gwasConstraint);
    constraints.push(qtlStudyConstraint);
    // Use OR logic: trait must have either GWAS or QTLStudy (or both)
    constraintLogic = 'A OR B';
    hasGwasOrConstraint = true;
  }
  if (publicationId) {
    if (publicationId.includes('/')) {
      // DOI contains /, like 10.1007/s00122-006-0217-2
      const constraint = intermineConstraint(
        'Trait.publications.doi',
        '=',
        publicationId,
      );
      constraints.push(constraint);
    } else {
      // assume PMID if not DOI
      const constraint = intermineConstraint(
        'Trait.publications.pubMedId',
        '=',
        publicationId,
      );
      constraints.push(constraint);
    }
  }
  if (author) {
    const constraint = intermineConstraint(
      'Trait.publications.authors.name',
      'CONTAINS',
      author,
    );
    constraints.push(constraint);
  }

  // InterMine can't combine OUTER joins or implicit joins (from extended attributes) with OR constraints.
  // When using OR logic, use base attributes only; otherwise use extended attributes with OUTER joins.
  const attributes = hasGwasOrConstraint
    ? intermineTraitBaseAttributes
    : intermineTraitAttributes;
  const joins = hasGwasOrConstraint ? [] : traitJoinFactory();
  const query = interminePathQuery(
    attributes,
    intermineTraitSort,
    constraints,
    joins,
    constraintLogic,
  );
  // get the data - use appropriate response converter based on attribute set
  const dataPromise = hasGwasOrConstraint
    ? this.pathQuery(query, {page, pageSize}).then(
        (response: IntermineTraitBaseResponse) => response2traitsBase(response),
      )
    : this.pathQuery(query, {page, pageSize}).then(
        (response: IntermineTraitResponse) => response2traits(response),
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
