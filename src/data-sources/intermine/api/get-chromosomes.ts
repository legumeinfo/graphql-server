import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLChromosome,
    IntermineChromosomeResponse,
    intermineChromosomeAttributes,
    intermineChromosomeSort,
    response2chromosomes,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';
import { sequenceFeatureJoinFactory } from './sequence-feature.js';


export type GetChromosomesOptions = {
    genus?: string;
    species?: string;
    strain?: string;
    assembly?: string;
    annotation?: string;
} & PaginationOptions;


export async function getChromosomes(
    {
        genus,
        species,
        strain,
        assembly,
        annotation,
        page,
        pageSize,
    }: GetChromosomesOptions,
): Promise<ApiResponse<GraphQLChromosome[]>> {
    const constraints = [];
    if (genus) {
        constraints.push(intermineConstraint('Chromosome.organism.genus', '=', genus));
    }
    if (species) {
        constraints.push(intermineConstraint('Chromosome.organism.species', '=', species));
    }
    if (strain) {
        constraints.push(intermineConstraint('Gene.strain.identifier', '=', strain));
    }
    if (assembly) {
        constraints.push(intermineConstraint('Gene.assemblyVersion', '=', assembly));
    }
    if (annotation) {
        constraints.push(intermineConstraint('Gene.annotationVersion', '=', annotation));
    }
    const joins = sequenceFeatureJoinFactory('Chromosome');
    const query = interminePathQuery(
        intermineChromosomeAttributes,
        intermineChromosomeSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineChromosomeResponse) => response2chromosomes(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
