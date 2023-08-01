import { IntermineServer } from '../intermine.server.js';

// author
import { getAuthor } from './get-author.js';
import { getAuthors } from './get-authors.js';
// chromosome
import { getChromosome } from './get-chromosome.js';
// data set
import { getDataSet } from './get-data-set.js';
import {
    getDataSetsForBioEntity,
    getDataSetsForGeneticMap,
    getDataSetsForLinkageGroup,
    getDataSetsForLocation,
    getDataSetsForOntologyAnnotation,
    getDataSetsForOntology,
    getDataSetsForOntologyTerm,
    getDataSetsForPanGeneSet,
    getDataSetsForPathway,
    getDataSetsForPhylotree,
    getDataSetsForSyntenyBlock,
} from './get-data-sets.js';
// expression sample
import { getExpressionSample } from './get-expression-sample.js';
import { getExpressionSamples } from './get-expression-samples.js';
import { searchExpressionSamples } from './search-expression-samples.js';
// expression source
import { getExpressionSource } from './get-expression-source.js';
import { searchExpressionSources } from './search-expression-sources.js';
// genes
import { getGene } from './get-gene.js';
import { getGenes } from './get-genes.js';
import { searchGenes } from './search-genes.js';
// gene family
import { getGeneFamily } from './get-gene-family.js';
import { getGeneFamilies } from './get-gene-families.js';
import { searchGeneFamilies } from './search-gene-families.js';
// gene family assignment
import { getGeneFamilyAssignment } from './get-gene-family-assignment.js';
import { getGeneFamilyAssignments} from './get-gene-family-assignments.js';
import { getGeneFamilyAssignmentsForProtein } from './get-gene-family-assignments-for-protein.js';
// gene family tally
import { getGeneFamilyTally } from './get-gene-family-tally.js';
import { getGeneFamilyTallies } from './get-gene-family-tallies.js';
// genetic map
import { getGeneticMap } from './get-genetic-map.js';
import { searchGeneticMaps } from './search-genetic-maps.js';
// genetic marker
import { getGeneticMarker } from './get-genetic-marker.js';
import { getGeneticMarkers } from './get-genetic-markers.js';
// genotyping platform
import { getGenotypingPlatform } from './get-genotyping-platform.js';
import { getGenotypingPlatforms } from './get-genotyping-platforms.js';
// gwas
import { getGWAS } from './get-gwas.js';
import { getGWASForTrait } from './get-gwas-for-trait.js';
import { searchGWASes } from './search-gwases.js';
// gwas result
import { getGWASResult } from './get-gwas-result.js';
import { getGWASResults } from './get-gwas-results.js';
// linkage group
import { getLinkageGroup } from './get-linkage-group.js';
import { getLinkageGroups } from './get-linkage-groups.js';
// linkage group position
import { getLinkageGroupPosition } from './get-linkage-group-position.js';
import { getLinkageGroupPositions } from './get-linkage-group-positions.js';
// location
import { getLocation } from './get-location.js';
import { getLocations } from './get-locations.js';
// mRNA
import { getMRNA } from './get-mrna.js';
// newick
import { getNewick } from './get-newick.js';
// ontology
import { getOntology } from './get-ontology.js';
// ontology annotation
import { getOntologyAnnotation } from './get-ontology-annotation.js';
import { getOntologyAnnotations } from './get-ontology-annotations.js';
// ontology term
import { getOntologyTerm } from './get-ontology-term.js';
import { getOntologyTerms } from './get-ontology-terms.js';
import { getOntologyTermOntology } from './get-ontology-term-ontology.js';
import { searchOntologyTerms } from './search-ontology-terms.js';
// organism
import { getOrganism } from './get-organism.js';
import { searchOrganisms } from './search-organisms.js';
// pan gene set
import { getPanGeneSet } from './get-pan-gene-set.js';
import { getPanGeneSets } from './get-pan-gene-sets.js';
// pangenes (which are genes)
import { getPangenes } from './get-pangenes.js';
// pathway
import { getPathway } from './get-pathway.js';
import { getPathways } from './get-pathways.js';
// phylonode
import { getPhylonode } from './get-phylonode.js';
import { getPhylonodeForProtein } from './get-phylonode-for-protein.js';
import { getPhylonodes } from './get-phylonodes.js';
// phylotree
import { getPhylotree } from './get-phylotree.js';
// protein
import { getProtein } from './get-protein.js';
import { getProteins } from './get-proteins.js';
import { searchProteins } from './search-proteins.js';
// protein domain
import { getProteinDomain } from './get-protein-domain.js';
import { getProteinDomains } from './get-protein-domains.js';
import { searchProteinDomains } from './search-protein-domains.js';
// publication
import { getPublication } from './get-publication.js';
import { getPublications } from './get-publications.js';
import { searchPublications } from './search-publications.js';
// qtl
import { getQTL } from './get-qtl.js';
import { getQTLs } from './get-qtls.js';
import { searchQTLs } from './search-qtls.js';
// qtl study
import { getQTLStudy } from './get-qtl-study.js';
import { getQTLStudyForTrait } from './get-qtl-study-for-trait.js';
import { searchQTLStudies } from './search-qtl-studies.js';
// supercontig
import { getSupercontig } from './get-supercontig.js';
// syntenic region
import { getSyntenicRegion } from './get-syntenic-region.js';
import { getSyntenicRegions } from './get-syntenic-regions.js';
// synteny block
import { getSyntenyBlock } from './get-synteny-block.js';
// strain
import { getStrain } from './get-strain.js';
import { getStrains } from './get-strains.js';
import { searchStrains } from './search-strains.js';
// trait
import { getTrait } from './get-trait.js';
import { searchTraits } from './search-traits.js';
// mine web properties
import { getMineWebProperties } from './get-mine-web-properties.js';


// the constructor used to type constrain the super class
export type ApiBaseConstructor<T = IntermineServer> = new (...args: any[]) => T;


// the interface of the class generated by the mixin
export declare class ApiMixinInterface {
    // author
    getAuthor: Function;
    getAuthors: Function;
    // chromosome
    getChromosome: Function;
    // data set
    getDataSet: Function;
    getDataSetsForBioEntity: Function;
    getDataSetsForGeneticMap: Function;
    getDataSetsForLinkageGroup: Function;
    getDataSetsForLocation: Function;
    getDataSetsForOntologyAnnotation: Function;
    getDataSetsForOntology: Function;
    getDataSetsForOntologyTerm: Function;
    getDataSetsForPathway: Function;
    getDataSetsForPanGeneSet: Function;
    getDataSetsForPhylotree: Function;
    getDataSetsForSyntenyBlock: Function;
    // expression sample
    getExpressionSample: Function;
    getExpressionSamples: Function;
    searchExpressionSamples: Function;
    // expression source
    getExpressionSource: Function;
    searchExpressionSources: Function;
    // genes
    getGene: Function;
    getGenes: Function;
    searchGenes: Function;
    // gene family
    getGeneFamily: Function;
    getGeneFamilies: Function;
    searchGeneFamilies: Function;
    // gene family assignment
    getGeneFamilyAssignment: Function;
    getGeneFamilyAssignments: Function;
    getGeneFamilyAssignmentsForProtein: Function;
    // gene family tally
    getGeneFamilyTally: Function;
    getGeneFamilyTallies: Function;
    // genetic map
    getGeneticMap: Function;
    searchGeneticMaps: Function;
    // genetic marker
    getGeneticMarker: Function;
    getGeneticMarkers: Function;
    // genotyping platform
    getGenotypingPlatform: Function;
    getGenotypingPlatforms: Function;
    // gwas
    getGWAS: Function;
    getGWASForTrait: Function;
    searchGWASes: Function;
    // gwas result
    getGWASResult: Function;
    getGWASResults: Function;
    // linkage group
    getLinkageGroup: Function;
    getLinkageGroups: Function;
    // linkage group position
    getLinkageGroupPosition: Function;
    getLinkageGroupPositions: Function;
    // location
    getLocation: Function;
    getLocations: Function;
    // mRNA
    getMRNA: Function;
    // newick
    getNewick: Function;
    // ontology
    getOntology: Function;
    // ontology annotation
    getOntologyAnnotation: Function;
    getOntologyAnnotations: Function;
    // ontology term
    getOntologyTerm: Function;
    getOntologyTerms: Function;
    getOntologyTermOntology: Function;
    searchOntologyTerms: Function;
    // organism
    getOrganism: Function;
    searchOrganisms: Function;
    // pan-gene set
    getPanGeneSet: Function;
    getPanGeneSets: Function;
    // pangenes
    getPangenes: Function;
    // pathway
    getPathway: Function;
    getPathways: Function;
    // phylonode
    getPhylonode: Function;
    getPhylonodeForProtein: Function;
    getPhylonodes: Function;
    // phylotree
    getPhylotree: Function;
    // protein
    getProtein: Function;
    getProteins: Function;
    searchProteins: Function;
    // protein domain
    getProteinDomain: Function;
    getProteinDomains: Function;
    searchProteinDomains: Function;
    // publication
    getPublication: Function;
    getPublications: Function;
    searchPublications: Function;
    // qtl
    getQTL: Function;
    getQTLs: Function;
    searchQTLs: Function;
    // qtl study
    getQTLStudy: Function;
    getQTLStudyForTrait: Function;
    searchQTLStudies: Function;
    // supercontig
    getSupercontig: Function;
    // syntenic region
    getSyntenicRegion: Function;
    getSyntenicRegions: Function;
    // synteny block
    getSyntenyBlock: Function;
    // strain
    getStrain: Function;
    getStrains: Function;
    searchStrains: Function;
    // trait
    getTrait: Function;
    searchTraits: Function;
    // mine web properties
    getMineWebProperties: Function;
}


// a mixin that adds the API to the IntermineServer class
export const ApiMixin = <T extends ApiBaseConstructor<IntermineServer>>(superClass: T) => {

    class ApiMixinClass extends superClass {
        // author
        getAuthor = getAuthor;
        getAuthors = getAuthors;
        // chromosome
        getChromosome = getChromosome;
        // data set
        getDataSet = getDataSet;
        getDataSetsForBioEntity = getDataSetsForBioEntity;
        getDataSetsForGeneticMap = getDataSetsForGeneticMap;
        getDataSetsForLinkageGroup = getDataSetsForLinkageGroup;
        getDataSetsForLocation = getDataSetsForLocation;
        getDataSetsForOntologyAnnotation = getDataSetsForOntologyAnnotation;
        getDataSetsForOntology = getDataSetsForOntology;
        getDataSetsForOntologyTerm = getDataSetsForOntologyTerm;
        getDataSetsForPathway = getDataSetsForPathway;
        getDataSetsForPanGeneSet = getDataSetsForPanGeneSet;
        getDataSetsForPhylotree = getDataSetsForPhylotree;
        getDataSetsForSyntenyBlock = getDataSetsForSyntenyBlock;
        // expression sample
        getExpressionSample = getExpressionSample;
        getExpressionSamples = getExpressionSamples;
        searchExpressionSamples = searchExpressionSamples;
        // expression source
        getExpressionSource = getExpressionSource;
        searchExpressionSources = searchExpressionSources;
        // genes
        getGene = getGene;
        getGenes = getGenes;
        searchGenes = searchGenes;
        // gene family
        getGeneFamily = getGeneFamily;
        getGeneFamilies = getGeneFamilies;
        searchGeneFamilies = searchGeneFamilies;
        // gene family assignment
        getGeneFamilyAssignment = getGeneFamilyAssignment;
        getGeneFamilyAssignments = getGeneFamilyAssignments;
        getGeneFamilyAssignmentsForProtein = getGeneFamilyAssignmentsForProtein;
        // gene family tally
        getGeneFamilyTally = getGeneFamilyTally;
        getGeneFamilyTallies = getGeneFamilyTallies;
        // genetic map
        getGeneticMap = getGeneticMap;
        searchGeneticMaps = searchGeneticMaps;
        // genetic marker
        getGeneticMarker = getGeneticMarker;
        getGeneticMarkers = getGeneticMarkers;
        // genotyping platform
        getGenotypingPlatform = getGenotypingPlatform;
        getGenotypingPlatforms = getGenotypingPlatforms;
        // gwas
        getGWAS = getGWAS;
        getGWASForTrait = getGWASForTrait;
        searchGWASes = searchGWASes;
        // gwas result
        getGWASResult = getGWASResult;
        getGWASResults = getGWASResults;
        // linkage group
        getLinkageGroup = getLinkageGroup;
        getLinkageGroups = getLinkageGroups;
        // linkage group position
        getLinkageGroupPosition = getLinkageGroupPosition;
        getLinkageGroupPositions = getLinkageGroupPositions;
        // location
        getLocation = getLocation;
        getLocations = getLocations;
        // mRNA
        getMRNA = getMRNA;
        // newick
        getNewick = getNewick;
        // ontology
        getOntology = getOntology;
        // ontology annotation
        getOntologyAnnotation = getOntologyAnnotation;
        getOntologyAnnotations = getOntologyAnnotations;
        // ontology term
        getOntologyTerm = getOntologyTerm;
        getOntologyTerms = getOntologyTerms;
        getOntologyTermOntology = getOntologyTermOntology;
        searchOntologyTerms = searchOntologyTerms;
        // organism
        getOrganism = getOrganism;
        searchOrganisms = searchOrganisms;
        // pan-gene set
        getPanGeneSet = getPanGeneSet;
        getPanGeneSets = getPanGeneSets;
        // pangenes
        getPangenes = getPangenes;
        // pathway
        getPathway = getPathway;
        getPathways = getPathways;
        // phylonode
        getPhylonode = getPhylonode;
        getPhylonodeForProtein = getPhylonodeForProtein;
        getPhylonodes = getPhylonodes;
        // phylotree
        getPhylotree = getPhylotree;
        // protein
        getProtein = getProtein;
        getProteins = getProteins;
        searchProteins = searchProteins;
        // protein domain
        getProteinDomain = getProteinDomain;
        getProteinDomains = getProteinDomains;
        searchProteinDomains = searchProteinDomains;
        // publication
        getPublication = getPublication;
        getPublications = getPublications;
        searchPublications = searchPublications;
        // qtl
        getQTL = getQTL;
        getQTLs = getQTLs;
        searchQTLs = searchQTLs;
        // qtl study
        getQTLStudy = getQTLStudy;
        getQTLStudyForTrait = getQTLStudyForTrait;
        searchQTLStudies = searchQTLStudies;
        // supercontig
        getSupercontig = getSupercontig;
        // syntenic region
        getSyntenicRegion = getSyntenicRegion;
        getSyntenicRegions = getSyntenicRegions;
        // synteny block
        getSyntenyBlock = getSyntenyBlock;
        // strain
        getStrain = getStrain;
        getStrains = getStrains;
        searchStrains = searchStrains;
        // trait
        getTrait = getTrait;
        searchTraits = searchTraits;
        // mine web properties
        getMineWebProperties = getMineWebProperties;
    }

    // cast return type to mixin's interface intersected with the superClass type
    // necessary because TypeScript can't infer mixed-in types...
    return ApiMixinClass as ApiBaseConstructor<ApiMixinInterface> & T;

};
