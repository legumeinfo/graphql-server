import {
    ApiResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLCDS,
    IntermineCDSResponse,
    intermineCDSAttributes,
    intermineCDSSort,
    response2cdss,
} from '../models/index.js';

// get a CDS by identifier
export async function getCDS(identifier: string):
Promise<ApiResponse<GraphQLCDS>> {
    const constraints = [intermineConstraint('CDS.primaryIdentifier', '=', identifier)];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('CDS.chromosome', 'OUTER'),
        intermineJoin('CDS.supercontig', 'OUTER'),
        intermineJoin('CDS.chromosomeLocation', 'OUTER'),
        intermineJoin('CDS.supercontigLocation', 'OUTER'),
        intermineJoin('CDS.sequenceOntologyTerm', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineCDSAttributes,
        intermineCDSSort,
        constraints,
        joins,
    );
    return this.pathQuery(query)
        .then((response: IntermineCDSResponse) => response2cdss(response))
        .then((cdss: Array<GraphQLCDS>) => {
            if (!cdss.length) return null;
            return cdss[0];
        })
        .then((cds: GraphQLCDS) => ({data: cds}));
}
