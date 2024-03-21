import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGeneFamily,
    GraphQLGeneFamilyTally,
    IntermineGeneFamilyTallyResponse,
    intermineGeneFamilyTallyAttributes,
    intermineGeneFamilyTallySort,
    response2geneFamilyTallies,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type SearchGeneFamilyTalliesOptions = {
    geneFamily?: GraphQLGeneFamily;
} & PaginationOptions;


// get GeneFamilyTallies associated with a GeneFamily
export async function getGeneFamilyTallies(
    {
        geneFamily,
        page,
        pageSize,
    }: SearchGeneFamilyTalliesOptions,
): Promise<ApiResponse<GraphQLGeneFamilyTally[]>> {
    const constraints = [];
    if (geneFamily) {
        const geneFamilyConstraint = intermineConstraint('GeneFamilyTally.geneFamily.id', '=', geneFamily.id);
        constraints.push(geneFamilyConstraint);
    }
    const query = interminePathQuery(
        intermineGeneFamilyTallyAttributes,
        intermineGeneFamilyTallySort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGeneFamilyTallyResponse) => response2geneFamilyTallies(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
