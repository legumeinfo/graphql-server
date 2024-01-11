import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import { IntermineBioEntity, graphqlBioEntityAttributes } from './bio-entity.js';

// <class name="ProteinMatch" extends="BioEntity" is-interface="true" term="http://purl.obolibrary.org/obo/SO:0000349">
// 	<attribute name="source" type="java.lang.String"/>
// 	<attribute name="signatureDesc" type="java.lang.String"/>
// 	<attribute name="status" type="java.lang.String"/>
// 	<attribute name="length" type="java.lang.Integer"/>
// 	<attribute name="target" type="java.lang.String"/>
// 	<attribute name="date" type="java.lang.String"/>
// 	<attribute name="accession" type="java.lang.String"/>
// 	<reference name="protein" referenced-type="Protein" reverse-reference="proteinMatches"/>
// </class>
export const intermineProteinMatchAttributes = [
    'ProteinMatch.id',
    'ProteinMatch.primaryIdentifier',   // Annotatable
    'ProteinMatch.description',         // BioEntity
    'ProteinMatch.symbol',              // BioEntity
    'ProteinMatch.name',                // BioEntity
    'ProteinMatch.assemblyVersion',     // BioEntity
    'ProteinMatch.annotationVersion',   // BioEntity
    'ProteinMatch.secondaryIdentifier', // BioEntity
    'ProteinMatch.organism.taxonId',    // BioEntity - resolve reference
    'ProteinMatch.strain.identifier',   // BioEntity - resolve reference
    'ProteinMatch.source',
    'ProteinMatch.signatureDesc',
    'ProteinMatch.status',
    'ProteinMatch.length',
    'ProteinMatch.target',
    'ProteinMatch.date',
    'ProteinMatch.accession',
    'ProteinMatch.protein.primaryIdentifier',   // resolve reference
];

export const intermineProteinMatchSort = 'ProteinMatch.primaryIdentifier';

export type IntermineProteinMatch = [
    ...IntermineBioEntity,
    string, // source
    string, // signatureDesc
    string, // status
    number, // length
    string, // target
    string, // date
    string, // accession
    string, // protein.identifier
];

export const graphqlProteinMatchAttributes = [
    ...graphqlBioEntityAttributes,
    'source',            // source
    'signatureDesc',     // signatureDesc
    'status',            // status
    'length',            // length
    'target',            // target
    'date',              // date
    'accession',         // accession
    'proteinIdentifier', // Protein resolution
];

export type GraphQLProteinMatch = {
    [prop in typeof graphqlProteinMatchAttributes[number]]: string;
}

export type IntermineProteinMatchResponse = IntermineDataResponse<IntermineProteinMatch>;
// converts an Intermine response into an array of GraphQL ProteinMatch objects

export function response2proteinMatches(response: IntermineProteinMatchResponse): Array<GraphQLProteinMatch> {
    return response2graphqlObjects(response, graphqlProteinMatchAttributes);
}
