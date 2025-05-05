import {
    ApiResponse,
    IntermineCountResponse,
    countResponse2graphqlPageInfo,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLTrait,
    IntermineTraitResponse,
    intermineTraitAttributes,
    intermineTraitSort,
    response2traits,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// get Genes using the given query and returns the expected GraphQL types
async function getTraits(pathQuery: string, {page, pageSize}: PaginationOptions): Promise<ApiResponse<GraphQLTrait>> {
    // get the data
    const dataPromise = this.pathQuery(pathQuery, {page, pageSize})
        .then((response: IntermineTraitResponse) => response2traits(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(pathQuery)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get Traits associated with a GeneFunction
export async function getTraitsForGeneFunction(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLTrait>> {
    const constraints = [intermineConstraint('Trait.geneFunctions.id', '=', id)];
    //const joins = traitJoinFactory();
    const joins = [intermineJoin('Trait.geneFunctions')];
    const query = interminePathQuery(
        intermineTraitAttributes,
        intermineTraitSort,
        constraints,
        joins,
    );
    return getTraits.call(this, query, {page, pageSize});
}
