import {
  IntermineAnnotatable,
  graphqlAnnotatableAttributes,
  intermineAnnotatableAttributesFactory,
} from './annotatable.js';
import { GraphQLSequenceFeature } from './sequence-feature.js';


export type GraphQLBioEntity =
  GraphQLSequenceFeature;  // all SequenceFeatures are BioEntities


// <class name="BioEntity" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="symbol" type="java.lang.String" term="http://www.w3.org/2004/02/skos/core#prefLabel"/>
// 	<attribute name="name" type="java.lang.String" term="http://www.w3.org/2000/01/rdf-schema#label"/>
// 	<attribute name="assemblyVersion" type="java.lang.String"/>
// 	<attribute name="annotationVersion" type="java.lang.String"/>
// 	<attribute name="secondaryIdentifier" type="java.lang.String" term="http://semanticscience.org/resource/SIO_000673"/>
// 	<reference name="organism" referenced-type="Organism" term="http://purl.org/net/orth#organism"/>
// 	<reference name="strain" referenced-type="Strain" term="http://semanticscience.org/resource/SIO_010055"/>
// 	<collection name="locations" referenced-type="Location" reverse-reference="feature"/>
// 	<collection name="synonyms" referenced-type="Synonym" reverse-reference="subject" term="http://purl.obolibrary.org/obo/synonym"/>
// 	<collection name="crossReferences" referenced-type="CrossReference" reverse-reference="subject" term="http://www.geneontology.org/formats/oboInOwl#hasDbXref"/>
// 	<collection name="dataSets" referenced-type="DataSet" reverse-reference="bioEntities" term="http://semanticscience.org/resource/SIO_001278"/>
// 	<collection name="locatedFeatures" referenced-type="Location" reverse-reference="locatedOn"/>
// </class>
export const intermineBioEntityAttributesFactory = (type = 'BioEntity') => [
    ...intermineAnnotatableAttributesFactory(type),
    `${type}.description`,         // BioEntity
    `${type}.symbol`,              // BioEntity
    `${type}.name`,                // BioEntity
    `${type}.assemblyVersion`,     // BioEntity
    `${type}.annotationVersion`,   // BioEntity
    `${type}.secondaryIdentifier`, // BioEntity
    `${type}.organism.taxonId`,    // BioEntity - resolve reference
    `${type}.strain.identifier`,   // BioEntity - resolve reference
];


export type IntermineBioEntity = [
    ...IntermineAnnotatable,
    string, // description
    string, // symbol
    string, // name
    string, // assemblyVersion
    string, // annotationVersion
    string, // secondaryIdentifier
    number, // organism.taxonId
    string, // strain.identifier
];

export const graphqlBioEntityAttributes = [
    ...graphqlAnnotatableAttributes,
    'description',         // description
    'symbol',              // symbol
    'name',                // name
    'assemblyVersion',     // assemblyVersion
    'annotationVersion',   // annotationVersion
    'secondaryIdentifier', // secondaryIdentifier
    'organismTaxonId',     // Organism resolution
    'strainIdentifier',    // Strain resolution
];
