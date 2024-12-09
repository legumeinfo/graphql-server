import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLOntologyTerm,
    IntermineOntologyTermResponse,
    intermineOntologyTermAttributes,
    intermineOntologyTermSort,
    intermineOntologyTermCrossReferenceAttributes,
    intermineOntologyTermCrossReferenceSort,
    intermineOntologyTermParentAttributes,
    intermineOntologyTermParentSort,
    intermineSequenceOntologyTermParentAttributes,
    intermineSequenceOntologyTermParentSort,
    response2ontologyTerms,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// get OntologyTerms using the given query and returns the expected GraphQL types
async function getOntologyTerms(pathQuery: string, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLOntologyTerm>> {
    // get the data
    const dataPromise = this.pathQuery(pathQuery, {page, pageSize})
        .then((response: IntermineOntologyTermResponse) => response2ontologyTerms(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(pathQuery, {summaryPath: 'OntologyTerm.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get OntologyTerms for a Trait by id
export async function getOntologyTermsForTrait(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLOntologyTerm>> {
    const constraints = [intermineConstraint('Trait.id', '=', id)];
    const query = interminePathQuery(
        intermineOntologyTermAttributes,
        intermineOntologyTermSort,
        constraints,
    );
    // get the data
    return getOntologyTerms.call(this, query, { page, pageSize });
}

// get (OntologyTerm) parents of an Ontology Term by id, which have no reverse reference from OntologyTerm
export async function getParentsForOntologyTerm(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLOntologyTerm>> {
    const constraints = [intermineConstraint('OntologyTerm.id', '=', id)];
    const query = interminePathQuery(
        intermineOntologyTermParentAttributes,
        intermineOntologyTermParentSort,
        constraints,
    );
    // get the data
    return getOntologyTerms.call(this, query, { page, pageSize });
}

// get (OntologyTerm) parents of an SOTerm by id, which have no reverse reference from SOTerm
export async function getParentsForSequenceOntologyTerm(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLOntologyTerm>> {
    const constraints = [intermineConstraint('SOTerm.id', '=', id)];
    const query = interminePathQuery(
        intermineSequenceOntologyTermParentAttributes,
        intermineSequenceOntologyTermParentSort,
        constraints,
    );
    // get the data
    return getOntologyTerms.call(this, query, { page, pageSize });
}

// get crossReferences of an OntologyTerm, which have no reverse reference from OntologyTerm
export async function getCrossReferencesForOntologyTerm(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLOntologyTerm>> {
    const constraints = [intermineConstraint('OntologyTerm.id', '=', id)];
    const query = interminePathQuery(
        intermineOntologyTermCrossReferenceAttributes,
        intermineOntologyTermCrossReferenceSort,
        constraints,
    );
    // get the data
    return getOntologyTerms.call(this, query, { page, pageSize });
}
