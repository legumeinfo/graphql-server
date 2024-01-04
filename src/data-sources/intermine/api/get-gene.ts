import {
    ApiResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLGene,
    IntermineGeneResponse,
    intermineGeneAttributes,
    intermineGeneSort,
    response2genes,
} from '../models/index.js';

// get a Gene by identifier
export async function getGene(identifier: string):
Promise<ApiResponse<GraphQLGene>> {
    const constraints = [
        intermineConstraint('Gene.primaryIdentifier', '=', identifier)
    ];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('Gene.chromosome', 'OUTER'),
        intermineJoin('Gene.supercontig', 'OUTER'),
        intermineJoin('Gene.chromosomeLocation', 'OUTER'),
        intermineJoin('Gene.supercontigLocation', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineGeneAttributes,
        intermineGeneSort,
        constraints,
        joins,
    );
    return this.pathQuery(query)
        .then((response: IntermineGeneResponse) => response2genes(response))
        .then((genes: Array<GraphQLGene>) => {
            if (!genes.length) return null;
            return genes[0];
        })
        .then((gene: GraphQLGene) => ({data: gene}));
}
