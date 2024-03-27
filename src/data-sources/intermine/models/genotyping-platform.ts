import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineAnnotatable,
  graphqlAnnotatableAttributes,
  intermineAnnotatableAttributesFactory,
} from './annotatable.js';

// <class name="GenotypingPlatform" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="primaryIdentifier" type="java.lang.String" term="http://semanticscience.org/resource/SIO_000673"/>
// 	<collection name="ontologyAnnotations" referenced-type="OntologyAnnotation" reverse-reference="subject" term="http://semanticscience.org/resource/SIO_000255"/>
// 	<collection name="publications" referenced-type="Publication" reverse-reference="entities" term="http://purl.org/dc/terms/bibliographicCitation"/>
//      <collection name="markers" referenced-type="GeneticMarker" reverse-reference="genotypingPlatforms"/>
// </class>
export const intermineGenotypingPlatformAttributes = [
    ...intermineAnnotatableAttributesFactory('GenotypingPlatform'),
];
export const intermineGenotypingPlatformSort = 'GenotypingPlatform.primaryIdentifier';
export type IntermineGenotypingPlatform = [
  ...IntermineAnnotatable,
];

// type GenotypingPlatform implements Annotatable {
//   ## Annotatable
//   id: ID!
//   identifier: ID!
//   ontologyAnnotations: [OntologyAnnotation!]!
//   publications: [Publication!]!
//   ## GenotypingPlatform
//   markers: [GeneticMarker]
// }
export const graphqlGenotypingPlatformAttributes = [
    ...graphqlAnnotatableAttributes,
];
export type GraphQLGenotypingPlatform = {
  [prop in typeof graphqlGenotypingPlatformAttributes[number]]: string;
}

export type IntermineGenotypingPlatformResponse = IntermineDataResponse<IntermineGenotypingPlatform>;
export function response2genotypingPlatforms(response: IntermineGenotypingPlatformResponse): Array<GraphQLGenotypingPlatform> {
    return response2graphqlObjects(response, graphqlGenotypingPlatformAttributes);
}
