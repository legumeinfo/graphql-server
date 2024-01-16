import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// ProteinDomain InterMine path query attributes
// <class name="ProteinDomain" extends="Annotatable" is-interface="true" term="http://purl.obolibrary.org/obo/SO:0000417">
//  	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="type" type="java.lang.String"/>
// 	<attribute name="name" type="java.lang.String"/>
//	<attribute name="shortName" type="java.lang.String"/>
// 	<collection name="genes" referenced-type="Gene" reverse-reference="proteinDomains"/>
// 	<collection name="geneFamilies" referenced-type="GeneFamily" reverse-reference="proteinDomains"/>
// 	<collection name="childFeatures" referenced-type="ProteinDomain"/>
// 	<collection name="foundIn" referenced-type="ProteinDomain"/>
// 	<collection name="parentFeatures" referenced-type="ProteinDomain"/>
// 	<collection name="contains" referenced-type="ProteinDomain"/>
// </class>
export const intermineProteinDomainAttributes = [
    'ProteinDomain.id',
    'ProteinDomain.primaryIdentifier', // Annotatable
    'ProteinDomain.description',
    'ProteinDomain.type',
    'ProteinDomain.name',
    'ProteinDomain.shortName',
];
export const intermineProteinDomainSort = 'ProteinDomain.primaryIdentifier';

export type IntermineProteinDomain = [
  number, // id
  string, // primaryIdentifier
  string, // description
  string, // type
  string, // name
  string, // shortName
];

export const graphqlProteinDomainAttributes = [
    'id',            // id
    'identifier',    // primaryIdentifier
    'description',   // description
    'type',          // type
    'name',          // name
    'shortName',     // shortName
];

export type GraphQLProteinDomain = {
  [prop in typeof graphqlProteinDomainAttributes[number]]: string;
}

export type IntermineProteinDomainResponse = IntermineDataResponse<IntermineProteinDomain>;
// converts an Intermine response into an array of GraphQL ProteinDomain objects

export function response2proteinDomains(response: IntermineProteinDomainResponse): Array<GraphQLProteinDomain> {
    return response2graphqlObjects(response, graphqlProteinDomainAttributes);
}

// ProteinDomain.childFeatures are ProteinDomains
export const intermineProteinDomainChildFeatureAttributes = [
    'ProteinDomain.childFeatures.id',
    'ProteinDomain.childFeatures.primaryIdentifier', // Annotatable
    'ProteinDomain.childFeatures.description',
    'ProteinDomain.childFeatures.type',
    'ProteinDomain.childFeatures.name',
    'ProteinDomain.childFeatures.shortName',
];
export const intermineProteinDomainChildFeatureSort = 'ProteinDomain.childFeatures.primaryIdentifier';
// use IntermineProteinDomain
// use graphqlProteinDomainAttributes
// use GraphQLProteinDomain
// use IntermineProteinDomainResponse
// use response2proteinDomains

// ProteinDomain.parentFeatures are ProteinDomains
export const intermineProteinDomainParentFeatureAttributes = [
    'ProteinDomain.parentFeatures.id',
    'ProteinDomain.parentFeatures.primaryIdentifier', // Annotatable
    'ProteinDomain.parentFeatures.description',
    'ProteinDomain.parentFeatures.type',
    'ProteinDomain.parentFeatures.name',
    'ProteinDomain.parentFeatures.shortName',
];
export const intermineProteinDomainParentFeatureSort = 'ProteinDomain.parentFeatures.primaryIdentifier';
// use IntermineProteinDomain
// use graphqlProteinDomainAttributes
// use GraphQLProteinDomain
// use IntermineProteinDomainResponse
// use response2proteinDomains

