import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
  GraphQLGeneticMarker,
  GraphQLGWAS,
  GraphQLGWASResult,
  GraphQLTrait,
  IntermineGWASResultResponse,
  intermineGWASResultAttributes,
  intermineGWASResultSort,
  response2gwasResults,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetGWASResultsOptions = {
  gwas?: GraphQLGWAS;
  trait?: GraphQLTrait;
  geneticMarker?: GraphQLGeneticMarker;
} & PaginationOptions;


// get GWASResults for a GWAS, Trait, GeneticMarker
export async function getGWASResults(
    {gwas, trait, geneticMarker, page, pageSize}: GetGWASResultsOptions,
): Promise<ApiResponse<GraphQLGWASResult[]>> {
    const constraints = [];
    if (gwas) {
        const gwasConstraint = intermineConstraint('GWASResult.gwas.id', '=', gwas.id);
        constraints.push(gwasConstraint);
    }
    if (trait) {
        const traitConstraint = intermineConstraint('GWASResult.trait.id', '=', trait.id);
        constraints.push(traitConstraint);
    }
    if (geneticMarker) {
        const geneticMarkerConstraint = intermineConstraint('GWASResult.markers.id', '=', geneticMarker.id);
        constraints.push(geneticMarkerConstraint);
    }
    const query = interminePathQuery(
        intermineGWASResultAttributes,
        intermineGWASResultSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGWASResultResponse) => response2gwasResults(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
