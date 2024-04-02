import { GraphQLBioEntity } from './bio-entity.js';
import { GraphQLExpressionSample } from './expression-sample.js';
import { GraphQLExpressionSource } from './expression-source.js';
import { GraphQLGeneFamily } from './gene-family.js';
import { GraphQLGeneticMap } from './genetic-map.js';
import { GraphQLGenotypingPlatform } from './genotyping-platform.js';
import { GraphQLGWAS } from './gwas.js';
import { GraphQLGWASResult } from './gwas-result.js';
import { GraphQLLinkageGroup } from './linkage-group.js';
import { GraphQLPanGeneSet } from './pan-gene-set.js';
import { GraphQLPathway } from './pathway.js';
import { GraphQLPhylotree } from './phylotree.js';
import { GraphQLProteinDomain } from './protein-domain.js';
import { GraphQLQTL } from './qtl.js';
import { GraphQLQTLStudy } from './qtl-study.js';
import { GraphQLTrait } from './trait.js';


export type GraphQLAnnotatable =
    GraphQLBioEntity |
    GraphQLExpressionSample |
    GraphQLExpressionSource |
    GraphQLGeneFamily |
    GraphQLGeneticMap |
    GraphQLGenotypingPlatform |
    GraphQLGWAS |
    GraphQLGWASResult |
    GraphQLLinkageGroup |
    GraphQLPanGeneSet |
    GraphQLPathway |
    GraphQLPhylotree |
    GraphQLProteinDomain |
    GraphQLQTL |
    GraphQLQTLStudy |
    GraphQLTrait;

export const intermineAnnotatableAttributesFactory = (type = 'Annotatable') => [
    `${type}.id`,
    `${type}.primaryIdentifier`,
];

export type IntermineAnnotatable = [
    number,
    string,
];

export const graphqlAnnotatableAttributes = [
    'id',
    'identifier',
];
