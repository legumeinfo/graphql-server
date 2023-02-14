import { GraphQLExpressionSource } from './expression-source.js';
import { GraphQLExpressionSample } from './expression-sample.js';
import { GraphQLGene } from './gene.js';
import { GraphQLGeneFamily } from './gene-family.js';
import { GraphQLGeneticMap } from './genetic-map.js';
import { GraphQLGWAS } from './gwas.js';
import { GraphQLMRNA } from './mrna.js';
import { GraphQLPathway } from './pathway.js';
import { GraphQLProteinDomain } from './protein-domain.js';
import { GraphQLTrait } from './trait.js';
import { GraphQLQTLStudy } from './qtl-study.js';


export type GraphQLAnnotatable =
  GraphQLExpressionSource |
  GraphQLExpressionSample |
  GraphQLGene |
  GraphQLGeneFamily |
  GraphQLGeneticMap |
  GraphQLGWAS |
  GraphQLMRNA |
  GraphQLPathway |
  GraphQLProteinDomain |
  GraphQLTrait |
  GraphQLQTLStudy;
