import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineSequenceFeature,
  graphqlSequenceFeatureAttributes,
  intermineSequenceFeatureAttributesFactory,
} from './sequence-feature.js';

// <class name="GeneFlankingRegion" extends="SequenceFeature" is-interface="true" term="http://purl.obolibrary.org/obo/SO_0000316,http://purl.obolibrary.org/obo/SO:0000316">
// 	<attribute name="isPrimary" type="java.lang.Boolean"/>
// 	<reference name="transcript" referenced-type="Transcript" reverse-reference="GeneFlankingRegions"/>
// </class>
export const intermineGeneFlankingRegionAttributes = [
    ...intermineSequenceFeatureAttributesFactory('GeneFlankingRegion'),
    'GeneFlankingRegion.gene.primaryIdentifier',          // reference resolution
];
export const intermineGeneFlankingRegionSort = 'GeneFlankingRegion.primaryIdentifier';

export type IntermineGeneFlankingRegion = [
    ...IntermineSequenceFeature,
    string, // gene.primaryIdentifier
];

export const graphqlGeneFlankingRegionAttributes = [
    ...graphqlSequenceFeatureAttributes,
    'geneIdentifier', // gene.primaryIdentifier
];

export type GraphQLGeneFlankingRegion = {
    [prop in typeof graphqlGeneFlankingRegionAttributes[number]]: string;
}

export type IntermineGeneFlankingRegionResponse = IntermineDataResponse<IntermineGeneFlankingRegion>;

// converts an Intermine response into an array of GraphQL GeneFlankingRegion objects
export function response2geneFlankingRegions(response: IntermineGeneFlankingRegionResponse): Array<GraphQLGeneFlankingRegion> {
    return response2graphqlObjects(response, graphqlGeneFlankingRegionAttributes);
}
