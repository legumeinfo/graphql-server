import {
    ApiResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLIntron,
    IntermineIntronResponse,
    intermineIntronAttributes,
    intermineIntronSort,
    response2introns,
} from '../models/index.js';

// get an Intron by identifier
export async function getIntron(identifier: string):
Promise<ApiResponse<GraphQLIntron>> {
    const constraints = [intermineConstraint('Intron.primaryIdentifier', '=', identifier)];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('Intron.chromosome', 'OUTER'),
        intermineJoin('Intron.supercontig', 'OUTER'),
        intermineJoin('Intron.chromosomeLocation', 'OUTER'),
        intermineJoin('Intron.supercontigLocation', 'OUTER'),
        intermineJoin('Intron.sequenceOntologyTerm', 'OUTER'),
    ];
    const query = interminePathQuery(
        intermineIntronAttributes,
        intermineIntronSort,
        constraints,
        joins,
    );
    return this.pathQuery(query)
        .then((response: IntermineIntronResponse) => response2introns(response))
        .then((introns: Array<GraphQLIntron>) => {
            if (!introns.length) return null;
            return introns[0];
        })
        .then((intron: GraphQLIntron) => ({data: intron}));
}
