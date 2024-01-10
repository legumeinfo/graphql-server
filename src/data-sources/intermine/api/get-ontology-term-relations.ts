import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    intermineOntologyTermRelationAttributes,
    intermineOntologyTermRelationSort,
    GraphQLOntologyTerm,
    GraphQLOntologyRelation,
    IntermineOntologyRelationResponse,
    response2ontologyRelations,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

export type GetOntologyTermRelationsOptions = {
    ontologyTerm?: GraphQLOntologyTerm;
} & PaginationOptions;

// get relations of an ontology term, which have no reverse reference to OntologyTerm
export async function getOntologyTermRelations(
    {ontologyTerm, page, pageSize}: GetOntologyTermRelationsOptions,
): Promise<ApiResponse<GraphQLOntologyRelation>> {
    const constraints = [intermineConstraint('OntologyTerm.id', '=', ontologyTerm.id)];
    const query = interminePathQuery(
        intermineOntologyTermRelationAttributes,
        intermineOntologyTermRelationSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineOntologyRelationResponse) => response2ontologyRelations(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'OntologyTerm.relations.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
