import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
  GraphQLGeneticMarker,
  GraphQLLinkageGroup,
  GraphQLTrait,
  GraphQLQTL,
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
} & PaginationOptions;


// get QTLs for a LinkageGroup, Trait, GeneticMarker
export async function getQTLs(
  {linkageGroup, trait, geneticMarker, start, size}: SearchQTLsOptions,
): Promise<ApiResponse<GraphQLQTL[]>> {
    const constraints = [];
    if (linkageGroup) {
        const linkageGroupConstraint = intermineConstraint('QTL.linkageGroup.id', '=', linkageGroup.id);
        constraints.push(linkageGroupConstraint);
    }
    if (trait) {
        const traitConstraint = intermineConstraint('QTL.trait.id', '=', trait.id);
        constraints.push(traitConstraint);
    }
    if (geneticMarker) {
        const geneticMarkerConstraint = intermineConstraint('QTL.markers.id', '=', geneticMarker.id);
        constraints.push(geneticMarkerConstraint);
    }
    const query = interminePathQuery(
        intermineQTLAttributes,
        intermineQTLSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {start, size})
        .then((response: IntermineQTLResponse) => response2qtls(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'QTL.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, start, size));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
