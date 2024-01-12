import {
    ApiResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLTrait,
    IntermineTraitResponse,
    intermineTraitAttributes,
    intermineTraitSort,
    response2traits,
} from '../models/index.js';

// get a Trait by identifier
export async function getTrait(identifier: string):
Promise<ApiResponse<GraphQLTrait>> {
    const constraints = [intermineConstraint('Trait.primaryIdentifier', '=', identifier)];
    // gwas or qtlStudy may be null
    const joins = [
        intermineJoin('Trait.gwas', 'OUTER'),
        intermineJoin('Trait.qtlStudy', 'OUTER'),
    ];
    const query = interminePathQuery(
        intermineTraitAttributes,
        intermineTraitSort,
        constraints,
        joins,
    );
    return this.pathQuery(query)
        .then((response: IntermineTraitResponse) => response2traits(response))
        .then((traits: Array<GraphQLTrait>) => {
            if (!traits.length) return null;
            return traits[0];
        })
        .then((trait: GraphQLTrait) => ({data: trait}));
}
