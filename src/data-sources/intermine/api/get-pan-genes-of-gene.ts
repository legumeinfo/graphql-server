import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGene,
    GraphQLPanGeneSet,
    IntermineGeneResponse,
    intermineGeneAttributes,
    intermineGeneSort,
    response2genes,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetPanGenesOfGeneOptions = {
    gene: GraphQTLGene;
} & PaginationOptions;


// get Genes that belong to the same PanGeneSets as the given gene.
export async function getPanGenesOfGene(
    {
        gene,
        page,
        pageSize,
    }: GetGenesOptions,
): Promise<ApiResponse<GraphQLGene[]>> {
    const constraints = [];

    // <query name="" model="genomic" view="Gene.panGeneSets.genes.primaryIdentifier" sortOrder="Gene.panGeneSets.genes.primaryIdentifier asc">
    //   <constraint path="Gene.primaryIdentifier" op="=" value="phavu.G19833.gnm1.ann1.Phvul.004G025600"/>
    // </query>

    constraints.push(intermineConstraint('Gene.primaryIdentifier', '=', gene.identifier));

    const query = interminePathQuery(
        intermineGeneAttributes,
        intermineGeneSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGeneResponse) => response2genes(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Gene.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
