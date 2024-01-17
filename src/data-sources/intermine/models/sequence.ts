import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// <class name="Sequence" is-interface="true" term="http://edamontology.org/data_2044">
// 	<attribute name="md5checksum" type="java.lang.String" term="http://purl.uniprot.org/core/md5Checksum"/>
// 	<attribute name="residues" type="org.intermine.objectstore.query.ClobAccess" term="http://www.w3.org/1999/02/22-rdf-syntax-ns//value"/>
// 	<attribute name="length" type="int" term="http://purl.org/dc/terms/SizeOrDuration"/>
// </class>
export const intermineSequenceAttributes = [
    'Sequence.id',
    'Sequence.md5checksum',
    'Sequence.residues',
    'Sequence.length',
];
export const intermineSequenceSort = 'Sequence.length';

export type IntermineSequence = [
    number, // id
    string, // md5checksum
    string, // residues
    number, // length
];

export const graphqlSequenceAttributes = [
    'id',          // id
    'md5checksum', // md5checksum
    'residues',    // residues
    'length',      // length
];

export type GraphQLSequence = {
  [prop in typeof graphqlSequenceAttributes[number]]: string;
}

export type IntermineSequenceResponse = IntermineDataResponse<IntermineSequence>;

// converts an Intermine response into an array of GraphQL Sequence objects
export function response2sequences(response: IntermineSequenceResponse): Array<GraphQLSequence> {
    return response2graphqlObjects(response, graphqlSequenceAttributes);
}
