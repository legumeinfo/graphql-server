import {
    ApiResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLExon,
    IntermineExonResponse,
    intermineExonAttributes,
    intermineExonSort,
    response2exons,
} from '../models/index.js';

// get a Exon by identifier
export async function getExon(identifier: string):
Promise<ApiResponse<GraphQLExon>> {
    const constraints = [intermineConstraint('Exon.primaryIdentifier', '=', identifier)];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('Exon.chromosome', 'OUTER'),
        intermineJoin('Exon.supercontig', 'OUTER'),
        intermineJoin('Exon.chromosomeLocation', 'OUTER'),
        intermineJoin('Exon.supercontigLocation', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineExonAttributes,
        intermineExonSort,
        constraints,
        joins,
    );
    return this.pathQuery(query)
        .then((response: IntermineExonResponse) => response2exons(response))
        .then((exons: Array<GraphQLExon>) => {
            if (!exons.length) return null;
            return exons[0];
        })
        .then((exon: GraphQLExon) => ({data: exon}));
}
