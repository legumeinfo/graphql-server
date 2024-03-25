import { GraphQLBioEntity } from './bio-entity.js';
import { GraphQLExpressionSource } from './expression-source.js';
import { GraphQLExpressionSample } from './expression-sample.js';
import { GraphQLGeneFamily } from './gene-family.js';
import { GraphQLGeneticMap } from './genetic-map.js';
import { GraphQLGenotypingPlatform } from './genotyping-platform.js';
import { GraphQLGWAS } from './gwas.js';
import { GraphQLLinkageGroup } from './linkage-group.js';
import { GraphQLPanGeneSet } from './pan-gene-set.js';
import { GraphQLPathway } from './pathway.js';
import { GraphQLPhylotree } from './phylotree.js';
import { GraphQLProteinDomain } from './protein-domain.js';
import { GraphQLTrait } from './trait.js';
import { GraphQLQTL } from './qtl.js';
import { GraphQLQTLStudy } from './qtl-study.js';


export type GraphQLAnnotatable =
    GraphQLBioEntity |  // all BioEntities are Annotatable
    GraphQLExpressionSource |
    GraphQLExpressionSample |
    GraphQLGeneFamily |
    GraphQLGeneticMap |
    GraphQLGenotypingPlatform |
    GraphQLGWAS |
    GraphQLLinkageGroup |
    GraphQLPanGeneSet |
    GraphQLPathway |
    GraphQLPhylotree |
    GraphQLProteinDomain |
    GraphQLTrait |
    GraphQLQTL |
    GraphQLQTLStudy;

// <class name="Annotatable" is-interface="true">
// 	<attribute name="primaryIdentifier" type="java.lang.String" term="http://semanticscience.org/resource/SIO_000673"/>
// 	<collection name="ontologyAnnotations" referenced-type="OntologyAnnotation" reverse-reference="subject" term="http://semanticscience.org/resource/SIO_000255"/>
// 	<collection name="publications" referenced-type="Publication" reverse-reference="entities" term="http://purl.org/dc/terms/bibliographicCitation"/>
//      <collection name="dataSets" referenced-type="DataSet" reverse-reference="entities" term="http://semanticscience.org/resource/SIO_001278"/>
// </class>
export const intermineAnnotatableAttributesFactory = (type = 'Annotatable') => [
    `${type}.id`,
    `${type}.primaryIdentifier`,  // Annotatable
];

// this may be used for any type that extends Annotatable without additional attributes or references
export type IntermineAnnotatable = [
    number, // id
    string, // primaryIdentifier
];

// this may be used for any type that extends Annotatable without additional attributes or references
export const graphqlAnnotatableAttributes = [
    'id',         // id
    'identifier', // primaryIdentifier
];
