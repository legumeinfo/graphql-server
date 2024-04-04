import {
    ApiResponse,
    intermineConstraint,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLExon,
    IntermineExonResponse,
    intermineExonAttributes,
    intermineExonSort,
    response2exons,
} from '../models/index.js';
import { sequenceFeatureJoinFactory } from './sequence-feature.js';

// get a Exon by identifier
export async function getExon(identifier: string):
Promise<ApiResponse<GraphQLExon>> {
    const constraints = [intermineConstraint('Exon.primaryIdentifier', '=', identifier)];
    const joins = sequenceFeatureJoinFactory('Exon');
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
