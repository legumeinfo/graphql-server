
import { GraphQLAuthor, IntermineAuthor } from './author.js';
import { GraphQLBioEntity, IntermineBioEntity } from './bio-entity.js';
import { GraphQLChromosome, IntermineChromosome } from './chromosome.js';
import { GraphQLDataSet, IntermineDataSet } from './data-set.js';
import { GraphQLExpressionSample, IntermineExpressionSample } from './expression-sample.js';
import { GraphQLExpressionSource, IntermineExpressionSource } from './expression-source.js';
import { GraphQLExpressionValue, IntermineExpressionValue } from './expression-value.js';
import { GraphQLGene, IntermineGene } from './gene.js';
import { GraphQLGeneFamily, IntermineGeneFamily } from './gene-family.js';
import { GraphQLGeneFamilyAssignment, IntermineGeneFamilyAssignment } from './gene-family-assignment.js';
import { GraphQLGeneFamilyTally, IntermineGeneFamilyTally } from './gene-family-tally.js';
import { GraphQLGeneticMap, IntermineGeneticMap } from './genetic-map.js';
import { GraphQLGeneticMarker, IntermineGeneticMarker } from './genetic-marker.js';
import { GraphQLGenotypingPlatform, IntermineGenotypingPlatform } from './genotyping-platform.js';
import { GraphQLGWAS, IntermineGWAS } from './gwas.js';
import { GraphQLGWASResult, IntermineGWASResult } from './gwas-result.js';
import { GraphQLLinkageGroup, IntermineLinkageGroup } from './linkage-group.js';
import { GraphQLLinkageGroupPosition, IntermineLinkageGroupPosition } from './linkage-group-position.js';
import { GraphQLLocation, IntermineLocation } from './location.js';
import { GraphQLOntology, IntermineOntology } from './ontology.js';
import { GraphQLOntologyAnnotation, IntermineOntologyAnnotation } from './ontology-annotation.js';
import { GraphQLOntologyTerm, IntermineOntologyTerm } from './ontology-term.js';
import { GraphQLOrganism, IntermineOrganism } from './organism.js';
import { GraphQLNewick, IntermineNewick } from './newick.js';
import { GraphQLMRNA, IntermineMRNA } from './mrna.js';
import { GraphQLPanGeneSet, InterminePanGeneSet } from './pan-gene-set.js';
import { GraphQLPathway, InterminePathway } from './pathway.js';
import { GraphQLPhylonode, InterminePhylonode } from './phylonode.js';
import { GraphQLPhylotree, InterminePhylotree } from './phylotree.js';
import { GraphQLProteinDomain, IntermineProteinDomain } from './protein-domain.js';
import { GraphQLProtein, IntermineProtein } from './protein.js';
import { GraphQLPublication, InterminePublication } from './publication.js';
import { GraphQLQTL, IntermineQTL } from './qtl.js';
import { GraphQLQTLStudy, IntermineQTLStudy } from './qtl-study.js';
import { GraphQLSupercontig, IntermineSupercontig } from './supercontig.js';
import { GraphQLSyntenicRegion, IntermineSyntenicRegion } from './syntenic-region.js';
import { GraphQLSyntenyBlock, IntermineSyntenyBlock } from './synteny-block.js';
import { GraphQLStrain, IntermineStrain } from './strain.js';
import { GraphQLTrait, IntermineTrait } from './trait.js';


export type GraphQLModel =
    GraphQLAuthor |
    GraphQLBioEntity |
    GraphQLChromosome |
    GraphQLDataSet |
    GraphQLExpressionSample |
    GraphQLExpressionSource |
    GraphQLExpressionValue |
    GraphQLGene |
    GraphQLGeneFamily |
    GraphQLGeneFamilyAssignment |
    GraphQLGeneFamilyTally |
    GraphQLGeneticMap |
    GraphQLGeneticMarker |
    GraphQLGenotypingPlatform |
    GraphQLGWAS |
    GraphQLGWASResult |
    GraphQLLinkageGroup |
    GraphQLLinkageGroupPosition |
    GraphQLLocation |
    GraphQLOntology |
    GraphQLOntologyAnnotation |
    GraphQLOntologyTerm |
    GraphQLOrganism |
    GraphQLNewick |
    GraphQLMRNA |
    GraphQLPanGeneSet |
    GraphQLPathway |
    GraphQLPhylonode |
    GraphQLPhylotree |
    GraphQLProteinDomain |
    GraphQLProtein |
    GraphQLPublication |
    GraphQLQTL |
    GraphQLQTLStudy |
    GraphQLSupercontig |
    GraphQLSyntenicRegion |
    GraphQLSyntenyBlock |
    GraphQLStrain |
    GraphQLTrait;


export type IntermineModel =
    IntermineAuthor |
    IntermineBioEntity |
    IntermineChromosome |
    IntermineDataSet |
    IntermineExpressionSample |
    IntermineExpressionSource |
    IntermineExpressionValue |
    IntermineGene |
    IntermineGeneFamily |
    IntermineGeneFamilyAssignment |
    IntermineGeneFamilyTally |
    IntermineGeneticMap |
    IntermineGeneticMarker |
    IntermineGenotypingPlatform |
    IntermineGWAS |
    IntermineGWASResult |
    IntermineLinkageGroup |
    IntermineLinkageGroupPosition |
    IntermineLocation |
    IntermineOntology |
    IntermineOntologyAnnotation |
    IntermineOntologyTerm |
    IntermineOrganism |
    IntermineNewick |
    IntermineMRNA |
    InterminePanGeneSet |
    InterminePathway |
    InterminePhylonode |
    InterminePhylotree |
    IntermineProteinDomain |
    IntermineProtein |
    InterminePublication |
    IntermineQTL |
    IntermineQTLStudy |
    IntermineSupercontig |
    IntermineSyntenicRegion |
    IntermineSyntenyBlock |
    IntermineStrain |
    IntermineTrait;


export * from './annotatable.js';
export * from './author.js';
export * from './bio-entity.js';
export * from './chromosome.js';
export * from './data-set.js';
export * from './expression-sample.js';
export * from './expression-source.js';
export * from './expression-value.js';
export * from './gene.js';
export * from './gene-family.js';
export * from './gene-family-assignment.js';
export * from './gene-family-tally.js';
export * from './genetic-map.js';
export * from './genetic-marker.js';
export * from './genotyping-platform.js';
export * from './gwas.js';
export * from './gwas-result.js';
export * from './linkage-group.js';
export * from './linkage-group-position.js';
export * from './location.js';
export * from './ontology.js';
export * from './ontology-annotation.js';
export * from './ontology-term.js';
export * from './organism.js';
export * from './newick.js';
export * from './mrna.js';
export * from './pan-gene-set.js';
export * from './pathway.js';
export * from './phylonode.js';
export * from './phylotree.js';
export * from './protein-domain.js';
export * from './protein.js';
export * from './publication.js';
export * from './qtl.js';
export * from './qtl-study.js';
export * from './sequence-feature.js';
export * from './supercontig.js';
export * from './syntenic-region.js';
export * from './synteny-block.js';
export * from './strain.js';
export * from './trait.js';
