import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLChromosome,
  IntermineChromosomeResponse,
  intermineChromosomeAttributes,
  intermineChromosomeSort,
  response2chromosomes,
} from '../models/index.js';


// get a Chromosome by ID
export async function getChromosome(identifier: string): Promise<GraphQLChromosome> {
    const constraints = [intermineConstraint('Chromosome.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        intermineChromosomeAttributes,
        intermineChromosomeSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineChromosomeResponse) => response2chromosomes(response))
        .then((chromosomes: Array<GraphQLChromosome>) => {
            if (!chromosomes.length) {
                const msg = `Chromosome with primaryIdentifier '${identifier}' not found`;
                this.inputError(msg);
            }
            return chromosomes[0];
        });
}
