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
    GraphQLOntologyRelation,
    IntermineOntologyRelationResponse,
    response2ontologyRelations,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// get OntologyRelations for an OntologyTerm
export async function getOntologyRelationsForOntologyTerm(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLOntologyRelation>> {
    const constraints = [intermineConstraint('OntologyTerm.id', '=', id)];
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
