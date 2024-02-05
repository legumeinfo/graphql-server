import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLProteinMatch,
    IntermineProteinMatchResponse,
    intermineProteinMatchAttributes,
    intermineProteinMatchSort,
    response2proteinMatches,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// get ProteinMatches associated with a Protein
export async function getProteinMatchesForProtein(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLProteinMatch>> {
    const constraints = [intermineConstraint('ProteinMatch.protein.id', '=', id)];
    // all BioEntity-extending object queries must include these joins
    const joins = [
        intermineJoin('ProteinMatch.organism', 'OUTER'),
        intermineJoin('ProteinMatch.strain', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineProteinMatchAttributes,
        intermineProteinMatchSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineProteinMatchResponse) => response2proteinMatches(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'ProteinMatch.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
