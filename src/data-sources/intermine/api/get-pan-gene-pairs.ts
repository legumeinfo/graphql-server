import {
    ApiResponse,
    IntermineCountResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    intermineJoin,
    intermineNoneOfConstraint,
    intermineOneOfConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
    summaryResponse2graphqlResultsInfo,
} from '../intermine.server.js';
import {
    GraphQLPanGenePair,
    InterminePanGenePairResponse,
    interminePanGenePairAttributes,
    interminePanGenePairSort,
    //interminePanGenePairSummaryPath,
    response2panGenePairs,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetPanGenePairsOptions = {
    genus?: string;
    species?: string;
    strain?: string;
    assembly?: string;
    annotation?: string;
} & PaginationOptions;


// gets Pan Genes for the given gene identifiers that meet the given constraints
export async function getPanGenePairs(
    identifiers: string[],
    {
        genus,
        species,
        strain,
        assembly,
        annotation,
        page,
        pageSize,
    }: GetPanGenePairsOptions,
): Promise<ApiResponse<GraphQLPanGenePair[]>> {
    const constraints = [
        intermineOneOfConstraint('Gene.primaryIdentifier', identifiers),
        intermineNoneOfConstraint('Gene.panGeneSets.genes.primaryIdentifier', identifiers),
    ];
    if (genus) {
        constraints.push(intermineConstraint('Gene.panGeneSets.genes.organism.genus', '=', genus));
    }
    if (species) {
        constraints.push(intermineConstraint('Gene.panGeneSets.genes.organism.species', '=', species));
    }
    if (strain) {
        constraints.push(intermineConstraint('Gene.panGeneSets.genes.strain.identifier', '=', strain));
    }
    if (assembly) {
        constraints.push(intermineConstraint('Gene.panGeneSets.genes.assemblyVersion', '=', assembly));
    }
    if (annotation) {
        constraints.push(intermineConstraint('Gene.panGeneSets.genes.annotationVersion', '=', annotation));
    }
    const joins = [
      intermineJoin('Gene.panGeneSets'),
      intermineJoin('Gene.panGeneSets.genes'),
    ];
    const query = interminePathQuery(
        interminePanGenePairAttributes,
        interminePanGenePairSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: InterminePanGenePairResponse) => response2panGenePairs(response));
    // get a count of the data and convert it to page info
    // TODO: this count query isn't correct because it's counting the number of genes before the outer join
    //const pageInfoPromise = this.pathQueryCount(query)
    //    .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // get a summary of the data and convert it to summary info
    // TODO: these counts are incorrect because it's counting nested tables from the outer join
    //const resultsInfoPromise = this.pathQuerySummary(query, interminePanGenePairSummaryPath)
    //    .then((response: IntermineSummaryResponse) => summaryResponse2graphqlResultsInfo(response));
    const allDataPromise = this.pathQuery(query);
    const pageInfoPromise = allDataPromise
        .then((response: InterminePanGenePairResponse) => {
          const fakeCountResponse: IntermineCountResponse = {count: response.results.length};
          return countResponse2graphqlPageInfo(fakeCountResponse, page, pageSize);
        });
    const resultsInfoPromise = allDataPromise
        .then((response: InterminePanGenePairResponse) => {
          const reducer = (
            map: Record<string, number>,
            [query, ..._]: [string, string, string],
          ) => {
              if (!map.hasOwnProperty(query)) {
                map[query] = 0;
              }
              map[query] += 1;
              return map;
            };
          const idCountMap = response.results.reduce(reducer, {});
          const uniqueValues = Object.keys(idCountMap).length;
          const results = Object.entries(idCountMap);
          const fakeSummaryResponse: IntermineSummaryResponse = {uniqueValues, results};
          return summaryResponse2graphqlResultsInfo(fakeSummaryResponse);
        });
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise, resultsInfoPromise])
        .then(([data, pageInfo, resultsInfo]) => ({data, metadata: {pageInfo, resultsInfo}}));
}
