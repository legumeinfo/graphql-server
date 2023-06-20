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


// get a Chromosome by ID
// does NOT throw an error if the chromosome is not found, since this happens when the identifier belongs to a supercontig
export async function getChromosome(identifier: string):
Promise<ApiResponse<GraphQLChromosome>> {
    const constraints = [intermineConstraint('Chromosome.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        intermineChromosomeAttributes,
        intermineChromosomeSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineChromosomeResponse) => response2chromosomes(response))
        .then((chromosomes: Array<GraphQLChromosome>) => {
            if (!chromosomes.length) return null;
            return chromosomes[0];
        })
        .then((chromosome: GraphQLChromosome) => ({data: chromosome}));
}
