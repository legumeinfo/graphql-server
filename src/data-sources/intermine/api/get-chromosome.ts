import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLChromosome,
  IntermineChromosomeResponse,
  intermineChromosomeAttributes,
  intermineChromosomeSort,
  response2chromosomes,
} from '../models/index.js';
import { sequenceFeatureJoinFactory } from './sequence-feature.js';


// get a Chromosome by ID
export async function getChromosome(identifier: string):
Promise<ApiResponse<GraphQLChromosome>> {
    const constraints = [intermineConstraint('Chromosome.primaryIdentifier', '=', identifier)];
    const joins = sequenceFeatureJoinFactory('Exon');
    const query = interminePathQuery(
        intermineChromosomeAttributes,
        intermineChromosomeSort,
        constraints,
        joins,
    );
    return this.pathQuery(query)
        .then((response: IntermineChromosomeResponse) => response2chromosomes(response))
        .then((chromosomes: Array<GraphQLChromosome>) => {
            if (!chromosomes.length) return null;
            return chromosomes[0];
        })
        .then((chromosome: GraphQLChromosome) => ({data: chromosome}));
}
