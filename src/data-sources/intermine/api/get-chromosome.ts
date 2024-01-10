import {
    ApiResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLSequenceFeature,
    IntermineSequenceFeatureResponse,
    intermineChromosomeAttributes,
    intermineChromosomeSort,
    response2sequenceFeatures,
} from '../models/index.js';

// get a Chromosome for a given identifier
export async function getChromosome(identifier: string):
Promise<ApiResponse<GraphQLSequenceFeature>> {
    const constraints = [intermineConstraint('Chromosome.primaryIdentifier', '=', (identifier === null) ? '' : identifier)];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('Chromosome.chromosome', 'OUTER'),
        intermineJoin('Chromosome.supercontig', 'OUTER'),
        intermineJoin('Chromosome.chromosomeLocation', 'OUTER'),
        intermineJoin('Chromosome.supercontigLocation', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineChromosomeAttributes,
        intermineChromosomeSort,
        constraints,
        joins,
    );
    return this.pathQuery(query)
        .then((response: IntermineSequenceFeatureResponse) => response2sequenceFeatures(response))
        .then((chromosomes: Array<GraphQLSequenceFeature>) => {
            if (!chromosomes.length) return null;
            return chromosomes[0];
        })
        .then((chromosome: GraphQLSequenceFeature) => ({data: chromosome}));
}
