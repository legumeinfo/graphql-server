import {
    ApiResponse,
    intermineConstraint,
    intermineOneOfConstraint,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLGene,
    IntermineGeneResponse,
    intermineGeneAttributes,
    intermineGeneSort,
    response2genes,
} from '../models/index.js';
import { sequenceFeatureJoinFactory } from './sequence-feature.js';


// get a Gene by ID
export async function getGene(identifier: string, fields: string[]=[]):
Promise<ApiResponse<GraphQLGene>> {
    if (fields.indexOf('identifier') !== -1 && fields.length == 1) {
      return Promise.resolve({data: {identifier}});
    }
    const constraints = [intermineConstraint('Gene.primaryIdentifier', '=', identifier)];
    const joins = sequenceFeatureJoinFactory('Gene');
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


// get multiple Genes by ID
export async function getGenes(identifiers: string[], fields: string[]=[]):
Promise<ApiResponse<GraphQLGene[]>> {
    if (fields.indexOf('identifier') !== -1 && fields.length == 1) {
      return Promise.resolve({data: identifiers.map((identifier) => ({identifier}))});
    }
    const constraints = [intermineOneOfConstraint('Gene.primaryIdentifier', identifiers)];
    const joins = sequenceFeatureJoinFactory('Gene');
    const query = interminePathQuery(
        intermineGeneAttributes,
        intermineGeneSort,
        constraints,
        joins,
    );
    return this.pathQuery(query)
        .then((response: IntermineGeneResponse) => response2genes(response))
        .then((genes: Array<GraphQLGene>) => ({data: genes}));
}
