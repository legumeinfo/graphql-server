import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGeneticMarker,
    GraphQLLinkageGroup,
    GraphQLTrait,
    GraphQLQTL,
    GraphQLQTLStudy,
    IntermineQTLResponse,
    intermineQTLAttributes,
    intermineQTLSort,
    response2qtls,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type SearchQTLsOptions = {
    linkageGroup?: GraphQLLinkageGroup;
    trait?: GraphQLTrait;
    geneticMarker?: GraphQLGeneticMarker;
    qtlStudy?: GraphQLQTLStudy;
} & PaginationOptions;


// get QTLs for a LinkageGroup, Trait, GeneticMarker
export async function getQTLs(
    {linkageGroup, trait, geneticMarker, qtlStudy, page, pageSize}: SearchQTLsOptions,
): Promise<ApiResponse<GraphQLQTL[]>> {
    const constraints = [];
    if (linkageGroup) {
        const constraint = intermineConstraint('QTL.linkageGroup.id', '=', linkageGroup.id);
        constraints.push(constraint);
    }
    if (trait) {
        const constraint = intermineConstraint('QTL.trait.id', '=', trait.id);
        constraints.push(constraint);
    }
    if (geneticMarker) {
        const constraint = intermineConstraint('QTL.markers.id', '=', geneticMarker.id);
        constraints.push(constraint);
    }
    if (qtlStudy) {
        const constraint = intermineConstraint('QTL.qtlStudy.id', '=', qtlStudy.id);
        constraints.push(constraint);
    }
    const query = interminePathQuery(
        intermineQTLAttributes,
        intermineQTLSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineQTLResponse) => response2qtls(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
