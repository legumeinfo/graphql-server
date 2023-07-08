import { GraphQLBioEntity } from './bio-entity.js';
import { GraphQLExpressionSource } from './expression-source.js';
import { GraphQLExpressionSample } from './expression-sample.js';
import { GraphQLGeneFamily } from './gene-family.js';
import { GraphQLGeneticMap } from './genetic-map.js';
import { GraphQLGenotypingPlatform } from './genotyping-platform.js';
import { GraphQLGWAS } from './gwas.js';
import { GraphQLLinkageGroup } from './linkage-group.js';
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
    GraphQLPathway |
    GraphQLPhylotree |
    GraphQLProteinDomain |
    GraphQLTrait |
    GraphQLQTL |
    GraphQLQTLStudy;
