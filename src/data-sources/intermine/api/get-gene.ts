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

// <query name="" model="genomic" view="Gene.primaryIdentifier Gene.supercontig.primaryIdentifier Gene.chromosome.primaryIdentifier Gene.description Gene.name Gene.assemblyVersion Gene.annotationVersion Gene.secondaryIdentifier Gene.organism.taxonId Gene.strain.identifier Gene.length Gene.sequenceOntologyTerm.identifier Gene.chromosomeLocation.start Gene.supercontigLocation.start Gene.sequence.length Gene.ensemblName Gene.upstreamIntergenicRegion.primaryIdentifier Gene.downstreamIntergenicRegion.primaryIdentifier" longDescription="" sortOrder="Gene.primaryIdentifier asc">
//   <join path="Gene.supercontig" style="OUTER"/>
//   <join path="Gene.chromosome" style="OUTER"/>
//   <join path="Gene.chromosomeLocation" style="OUTER"/>
//   <join path="Gene.supercontigLocation" style="OUTER"/>
//   <constraint path="Gene.primaryIdentifier" op="=" value="phavu.G19833.gnm1.ann1.Phvul.001G003100"/>
// </query>

// export const intermineJoin =
//     (path: string, style: 'INNER'|'OUTER'='OUTER'): string => {
//         return `<join path='${path}' style='${style}'/>`;
//     };

// get a Gene by primaryIdentifier
export async function getGene(identifier: string):
Promise<ApiResponse<GraphQLGene>> {
    const constraints = [
        intermineConstraint('Gene.primaryIdentifier', '=', identifier)
    ];
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
