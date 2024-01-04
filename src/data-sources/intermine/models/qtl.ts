import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// <class name="QTL" extends="Annotatable" is-interface="true" term="http://purl.obolibrary.org/obo/SO:0001645">
//     <attribute name="lod" type="java.lang.Double"/>
//     <attribute name="likelihoodRatio" type="java.lang.Double"/>
//     <attribute name="end" type="java.lang.Double"/>
//     <attribute name="markerNames" type="java.lang.String"/>
//     <attribute name="name" type="java.lang.String"/>
//     <attribute name="markerR2" type="java.lang.Double"/>
//     <attribute name="start" type="java.lang.Double"/>
//     <attribute name="peak" type="java.lang.Double"/>
//     <reference name="trait" referenced-type="Trait" reverse-reference="qtls"/>
//     <reference name="qtlStudy" referenced-type="QTLStudy" reverse-reference="qtls"/>
//     <reference name="linkageGroup" referenced-type="LinkageGroup" reverse-reference="qtls"/>
//     <collection name="genes" referenced-type="Gene"/>
//     <collection name="markers" referenced-type="GeneticMarker" reverse-reference="qtls"/>
// </class>
export const intermineQTLAttributes = [
    'QTL.id',
    'QTL.primaryIdentifier',               // Annotatable
    'QTL.lod',
    'QTL.likelihoodRatio',
    'QTL.end',
    'QTL.markerNames',
    'QTL.name',
    'QTL.markerR2',
    'QTL.start',
    'QTL.peak',
    'QTL.trait.primaryIdentifier',         // reference resolution
    'QTL.qtlStudy.primaryIdentifier',      // reference resolution
    'QTL.linkageGroup.primaryIdentifier',  // reference resolution
];

export const intermineQTLSort = 'QTL.trait.name ASC QTL.primaryIdentifier ASC';

export type IntermineQTL = [
    number, // id
    string, // primaryIdentifier
    number, // lod
    number, // likelihoodRatio
    number, // end
    string, // markerNames
    string, // name
    number, // markerR2
    number, // start
    number, // peak
    string, // trait.primaryIdentifier
    string, // qtlStudy.primaryIdentifier
    string, // linkageGroup.primaryIdentifier
];

export const graphqlQTLAttributes = [
    'id',                     // id
    'identifier',             // primaryIdentifier
    'name',                   // name
    'lod',                    // lod
    'likelihoodRatio',        // likelihoodRatio
    'end',                    // end
    'markerNames',            // markerNames
    'markerR2',               // markerR2
    'start',                  // start
    'peak',                   // peak
    'traitIdentifier',        // resolve Trait
    'qtlStudyIdentifier',     // resolve QTLStudy
    'linkageGroupIdentifier', // resolve LinkageGroup
];

export type GraphQLQTL = {
    [prop in typeof graphqlQTLAttributes[number]]: string;
}

export type IntermineQTLResponse = IntermineDataResponse<IntermineQTL>;
export function response2qtls(response: IntermineQTLResponse): Array<GraphQLQTL> {
    return response2graphqlObjects(response, graphqlQTLAttributes);
}
