import { IntermineServer } from '../intermine.server.js';

// author
import { getAuthor } from './get-author.js';
import { getAuthorsForPublication } from './get-authors.js';
// cds
import { getCDS } from './get-cds.js';
import { getCDSsForTranscript } from './get-cdss.js';
// chromosome
import { getChromosome } from './get-chromosome.js';
// data set
import { getDataSet } from './get-data-set.js';
import {
    getDataSetsForAnnotatable,
    getDataSetsForDataSource,
    getDataSetsForLocation,
    getDataSetsForOntology,
    getDataSetsForOntologyAnnotation,
    getDataSetsForOntologyTerm,
    getDataSetsForOrganism,
    getDataSetsForStrain,
} from './get-data-sets.js';
// data source
import { getDataSource } from './get-data-source.js';
// exon
import { getExon } from './get-exon.js';
import { getExonsForTranscript } from './get-exons.js';
// expression sample
import { getExpressionSample } from './get-expression-sample.js';
import { getExpressionSamples } from './get-expression-samples.js';
import { searchExpressionSamples } from './search-expression-samples.js';
// expression source
import { getExpressionSource } from './get-expression-source.js';
import { searchExpressionSources } from './search-expression-sources.js';
// expression value
import { getExpressionValue } from './get-expression-value.js';
import { searchExpressionValues } from './search-expression-values.js';
// genes
import { getGene } from './get-gene.js';
import {
  getGenesForGeneFamily,
  getGenesForPanGeneSet,
  getGenesForPathway,
  getGenesForProtein,
  getGenesForProteinDomain,
  getAdjacentGenesForIntergenicRegion,
  getGenesForQTL,
} from './get-genes.js';
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
// gene flanking regino
import { getGeneFlankingRegion } from './get-gene-flanking-region.js';
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
// intergenic region
import { getIntergenicRegion } from './get-intergenic-region.js';
// intron
import { getIntron } from './get-intron.js';
import { getIntronsForGene, getIntronsForTranscript } from './get-introns.js';
// linkage group
import { getLinkageGroup } from './get-linkage-group.js';
import { getLinkageGroups } from './get-linkage-groups.js';
// linkage group position
import { getLinkageGroupPosition } from './get-linkage-group-position.js';
import { getLinkageGroupPositions } from './get-linkage-group-positions.js';
// location
import { getLocation } from './get-location.js';
import {
  getLocationsForBioEntity,
  getLocatedFeaturesForBioEntity,
} from './get-locations.js';
// mRNA
import { getMRNA } from './get-mrna.js';
import { getMRNAs } from './get-mrnas.js';
// newick
import { getNewick } from './get-newick.js';
// ontology
import { getOntology } from './get-ontology.js';
// ontology annotation
import { getOntologyAnnotation } from './get-ontology-annotation.js';
import {
  getOntologyAnnotationsForAnnotatable,
  getOntologyAnnotationsForOntologyTerm,
} from './get-ontology-annotations.js';
// ontology relation
import { getOntologyRelation } from './get-ontology-relation.js';
import { getOntologyRelationsForOntologyTerm } from './get-ontology-relations.js';
// ontology term
import { getOntologyTerm } from './get-ontology-term.js';
import {
  getOntologyTermsForTrait,
  getParentsForOntologyTerm,
  getParentsForSOTerm,
  getCrossReferencesForOntologyTerm,
} from './get-ontology-terms.js';
import { searchOntologyTerms } from './search-ontology-terms.js';
// ontology term synonym
import { getOntologyTermSynonym } from './get-ontology-term-synonym.js';
import { getOntologyTermSynonymsForOntologyTerm } from './get-ontology-term-synonyms.js';
// organism
import { getOrganism } from './get-organism.js';
import { searchOrganisms } from './search-organisms.js';
// pan gene set
import { getPanGeneSet } from './get-pan-gene-set.js';
import {
  getPanGeneSetsForGene,
  getPanGeneSetsForTranscript,
  getPanGeneSetsForProtein,
} from './get-pan-gene-sets.js';
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
// protein match
import { getProteinMatch } from './get-protein-match.js';
// publication
import { getPublication } from './get-publication.js';
import {
  getPublicationsForAnnotatable,
  getPublicationsForAuthor,
  getPublicationsForDataSource,
} from './get-publications.js';
import { searchPublications } from './search-publications.js';
// qtl
import { getQTL } from './get-qtl.js';
import { getQTLs } from './get-qtls.js';
import { searchQTLs } from './search-qtls.js';
// qtl study
import { getQTLStudy } from './get-qtl-study.js';
import { getQTLStudyForTrait } from './get-qtl-study-for-trait.js';
import { searchQTLStudies } from './search-qtl-studies.js';
// sequence
import { getSequence } from './get-sequence.js';
// sequence feature
import { getSequenceFeature } from './get-sequence-feature.js';
import {
  getChildFeaturesForSequenceFeature,
  getOverlappingFeaturesForSequenceFeature,
} from './get-sequence-features.js';
// SO term
import { getSOTerm } from './get-so-term.js';
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
// transcripts
import { getTranscript } from './get-transcript.js';
import {
  getTranscriptsForExon,
  getTranscriptsForGene,
  getTranscriptsForIntron,
  getTranscriptsForPanGeneSet,
  getTranscriptsForUTR,
} from './get-transcripts.js';
// utr
import { getUTR } from './get-utr.js';
import { getUTRsForTranscript } from './get-utrs.js';
// mine web properties
import { getMineWebProperties } from './get-mine-web-properties.js';


// the constructor used to type constrain the super class
export type ApiBaseConstructor<T = IntermineServer> = new (...args: any[]) => T;


// the interface of the class generated by the mixin
export declare class ApiMixinInterface {
    verifyIntermineVersion: Function;
    // author
    getAuthor: Function;
    getAuthorsForPublication: Function;
    // cds
    getCDS: Function;
    getCDSsForTranscript: Function;
    // chromosome
    getChromosome: Function;
    // data set
    getDataSet: Function;
    getDataSetsForAnnotatable: Function;
    getDataSetsForDataSource: Function;
    getDataSetsForLocation: Function;
    getDataSetsForOntology: Function;
    getDataSetsForOntologyAnnotation: Function;
    getDataSetsForOntologyTerm: Function;
    getDataSetsForOrganism: Function;
    getDataSetsForStrain: Function;
    // data source
    getDataSource: Function;
    // exon
    getExon: Function;
    getExonsForTranscript: Function;
    // expression sample
    getExpressionSample: Function;
    getExpressionSamples: Function;
    searchExpressionSamples: Function;
    // expression source
    getExpressionSource: Function;
    searchExpressionSources: Function;
    // expression value
    getExpressionValue: Function;
    searchExpressionValues: Function;
    // genes
    getGene: Function;
    getGenesForGeneFamily: Function;
    getGenesForPanGeneSet: Function;
    getGenesForPathway: Function;
    getGenesForProtein: Function;
    getGenesForProteinDomain: Function;
    getAdjacentGenesForIntergenicRegion: Function;
    getGenesForQTL: Function;
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
    // gene flanking region
    getGeneFlankingRegion: Function;
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
    // intergenic region
    getIntergenicRegion: Function;
    // intron
    getIntron: Function;
    getIntronsForGene: Function;
    getIntronsForTranscript: Function;
    // linkage group
    getLinkageGroup: Function;
    getLinkageGroups: Function;
    // linkage group position
    getLinkageGroupPosition: Function;
    getLinkageGroupPositions: Function;
    // location
    getLocation: Function;
    getLocationsForBioEntity: Function;
    getLocatedFeaturesForBioEntity: Function;
    // mRNA
    getMRNA: Function;
    getMRNAs: Function;
    // newick
    getNewick: Function;
    // ontology
    getOntology: Function;
    // ontology annotation
    getOntologyAnnotation: Function;
    getOntologyAnnotationsForAnnotatable: Function;
    getOntologyAnnotationsForOntologyTerm: Function;
    // ontology relation
    getOntologyRelation: Function;
    getOntologyRelationsForOntologyTerm: Function;
    // ontology term
    getOntologyTerm: Function;
    getOntologyTermsForTrait: Function;
    getParentsForOntologyTerm: Function;
    getParentsForSOTerm: Function;
    getCrossReferencesForOntologyTerm: Function;
    searchOntologyTerms: Function;
    // ontology term synonym
    getOntologyTermSynonym: Function;
    getOntologyTermSynonymsForOntologyTerm: Function;
    // organism
    getOrganism: Function;
    searchOrganisms: Function;
    // pan-gene set
    getPanGeneSet: Function;
    getPanGeneSetsForGene: Function;
    getPanGeneSetsForTranscript: Function;
    getPanGeneSetsForProtein: Function;
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
    // protein match
    getProteinMatch: Function;
    // publication
    getPublication: Function;
    getPublicationsForAnnotatable: Function;
    getPublicationsForAuthor: Function;
    getPublicationsForDataSource: Function;
    searchPublications: Function;
    // qtl
    getQTL: Function;
    getQTLs: Function;
    searchQTLs: Function;
    // qtl study
    getQTLStudy: Function;
    getQTLStudyForTrait: Function;
    searchQTLStudies: Function;
    // sequence
    getSequence: Function;
    // sequence feature
    getSequenceFeature: Function;
    getChildFeaturesForSequenceFeature: Function;
    getOverlappingFeaturesForSequenceFeature: Function;
    // SO term
    getSOTerm: Function;
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
    // transcript
    getTranscript: Function;
    getTranscriptsForExon: Function;
    getTranscriptsForGene: Function;
    getTranscriptsForIntron: Function;
    getTranscriptsForPanGeneSet: Function;
    getTranscriptsForUTR: Function;
    // UTR
    getUTR: Function;
    getUTRsForTranscript: Function;
    // mine web properties
    getMineWebProperties: Function;
}


// a mixin that adds the API to the IntermineServer class
export const ApiMixin = <T extends ApiBaseConstructor<IntermineServer>>(superClass: T) => {

    class ApiMixinClass extends superClass {

        static intermineVersion = '5.1.0.4';

        // Verifies that the version of the IntermineServer is the version the API is expecting
        async verifyIntermineVersion() {
          const properties = await this.webProperties();
          const serverVersion = properties['web-properties'].project.releaseVersion;
          if (serverVersion != ApiMixinClass.intermineVersion) {
            console.warn(`data-sources: intermine: ${this.baseURL} has version ${serverVersion}; expected ${ApiMixinClass.intermineVersion}`);
          }
        }

        // author
        getAuthor = getAuthor;
        getAuthorsForPublication = getAuthorsForPublication;
        // cds
        getCDS = getCDS;
        getCDSsForTranscript = getCDSsForTranscript;
        // chromosome
        getChromosome = getChromosome;
        // data set
        getDataSet = getDataSet;
        getDataSetsForAnnotatable = getDataSetsForAnnotatable;
        getDataSetsForDataSource = getDataSetsForDataSource;
        getDataSetsForLocation = getDataSetsForLocation;
        getDataSetsForOntology = getDataSetsForOntology;
        getDataSetsForOntologyAnnotation = getDataSetsForOntologyAnnotation;
        getDataSetsForOntologyTerm = getDataSetsForOntologyTerm;
        getDataSetsForOrganism = getDataSetsForOrganism;
        getDataSetsForStrain = getDataSetsForStrain;
        // data source
        getDataSource = getDataSource;
        // exon
        getExon = getExon;
        getExonsForTranscript = getExonsForTranscript;
        // expression sample
        getExpressionSample = getExpressionSample;
        getExpressionSamples = getExpressionSamples;
        searchExpressionSamples = searchExpressionSamples;
        // expression source
        getExpressionSource = getExpressionSource;
        searchExpressionSources = searchExpressionSources;
        // expression value
        getExpressionValue = getExpressionValue;
        searchExpressionValues = searchExpressionValues;
        // genes
        getGene = getGene;
        getGenesForGeneFamily = getGenesForGeneFamily;
        getGenesForPanGeneSet = getGenesForPanGeneSet;
        getGenesForPathway = getGenesForPathway;
        getGenesForProtein = getGenesForProtein;
        getGenesForProteinDomain = getGenesForProteinDomain;
        getAdjacentGenesForIntergenicRegion = getAdjacentGenesForIntergenicRegion;
        getGenesForQTL = getGenesForQTL;
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
        // gene flanking region
        getGeneFlankingRegion = getGeneFlankingRegion;
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
        // intergenic region
        getIntergenicRegion = getIntergenicRegion;
        // intron
        getIntron = getIntron;
        getIntronsForGene = getIntronsForGene;
        getIntronsForTranscript = getIntronsForTranscript;
        // linkage group
        getLinkageGroup = getLinkageGroup;
        getLinkageGroups = getLinkageGroups;
        // linkage group position
        getLinkageGroupPosition = getLinkageGroupPosition;
        getLinkageGroupPositions = getLinkageGroupPositions;
        // location
        getLocation = getLocation;
        getLocationsForBioEntity = getLocationsForBioEntity;
        getLocatedFeaturesForBioEntity = getLocatedFeaturesForBioEntity;
        // mRNA
        getMRNA = getMRNA;
        getMRNAs = getMRNAs;
        // newick
        getNewick = getNewick;
        // ontology
        getOntology = getOntology;
        // ontology annotation
        getOntologyAnnotation = getOntologyAnnotation;
        getOntologyAnnotationsForAnnotatable = getOntologyAnnotationsForAnnotatable;
        getOntologyAnnotationsForOntologyTerm = getOntologyAnnotationsForOntologyTerm;
        // ontology relation
        getOntologyRelation = getOntologyRelation;
        getOntologyRelationsForOntologyTerm = getOntologyRelationsForOntologyTerm;
        // ontology term
        getOntologyTerm = getOntologyTerm;
        getOntologyTermsForTrait = getOntologyTermsForTrait;
        getParentsForOntologyTerm = getParentsForOntologyTerm;
        getParentsForSOTerm = getParentsForSOTerm;
        getCrossReferencesForOntologyTerm = getCrossReferencesForOntologyTerm;
        searchOntologyTerms = searchOntologyTerms;
        // ontology term synonym
        getOntologyTermSynonym = getOntologyTermSynonym;
        getOntologyTermSynonymsForOntologyTerm = getOntologyTermSynonymsForOntologyTerm;
        // organism
        getOrganism = getOrganism;
        searchOrganisms = searchOrganisms;
        // pan-gene set
        getPanGeneSet = getPanGeneSet;
        getPanGeneSetsForGene = getPanGeneSetsForGene;
        getPanGeneSetsForTranscript = getPanGeneSetsForTranscript;
        getPanGeneSetsForProtein = getPanGeneSetsForProtein;
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
        // protein match
        getProteinMatch = getProteinMatch;
        // publication
        getPublication = getPublication;
        getPublicationsForAnnotatable = getPublicationsForAnnotatable;
        getPublicationsForAuthor = getPublicationsForAuthor;
        getPublicationsForDataSource = getPublicationsForDataSource;
        searchPublications = searchPublications;
        // qtl
        getQTL = getQTL;
        getQTLs = getQTLs;
        searchQTLs = searchQTLs;
        // qtl study
        getQTLStudy = getQTLStudy;
        getQTLStudyForTrait = getQTLStudyForTrait;
        searchQTLStudies = searchQTLStudies;
        // sequence
        getSequence = getSequence;
        // sequence feature
        getSequenceFeature = getSequenceFeature;
        getChildFeaturesForSequenceFeature = getChildFeaturesForSequenceFeature;
        getOverlappingFeaturesForSequenceFeature = getOverlappingFeaturesForSequenceFeature;
        // SO term
        getSOTerm = getSOTerm;
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
        // transcript
        getTranscript = getTranscript;
        getTranscriptsForExon = getTranscriptsForExon;
        getTranscriptsForGene = getTranscriptsForGene;
        getTranscriptsForIntron = getTranscriptsForIntron;
        getTranscriptsForPanGeneSet = getTranscriptsForPanGeneSet;
        getTranscriptsForUTR = getTranscriptsForUTR;
        // UTR
        getUTR = getUTR;
        getUTRsForTranscript = getUTRsForTranscript;
        // mine web properties
        getMineWebProperties = getMineWebProperties;
    }

    // cast return type to mixin's interface intersected with the superClass type
    // necessary because TypeScript can't infer mixed-in types...
    return ApiMixinClass as ApiBaseConstructor<ApiMixinInterface> & T;

};
