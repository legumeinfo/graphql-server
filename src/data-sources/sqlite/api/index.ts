// api/index.ts — mixes the ported API functions onto SqliteServer, mirroring the
// intermine ApiMixin pattern. Add ported functions here as you migrate them.
import {SqliteServer} from '../sqlite.server.js';
import {searchGenes} from './search-genes.js';
import {searchGeneFunctions} from './search-gene-functions.js';
import * as one from './get-one.js';
import {getGenes} from './get-many.js';
import {getPanGenePairs} from './get-pan-gene-pairs.js';
import * as rel from './relationships.js';
import * as srch from './search.js';

type Ctor<T = object> = new (...args: any[]) => T;

export function ApiMixin<T extends Ctor<SqliteServer>>(Base: T) {
  class ApiMixinClass extends Base {
    searchGenes = searchGenes;
    searchGeneFunctions = searchGeneFunctions;

    // get-one (getX(identifier) -> single object | null)
    getOrganism = one.getOrganism;
    getStrain = one.getStrain;
    getDataSource = one.getDataSource;
    getPublication = one.getPublication;
    getChromosome = one.getChromosome;
    getAuthor = one.getAuthor;
    getCDS = one.getCDS;
    getDataSet = one.getDataSet;
    getExon = one.getExon;
    getExpressionSample = one.getExpressionSample;
    getExpressionSource = one.getExpressionSource;
    getExpressionValue = one.getExpressionValue;
    getGene = one.getGene;
    getGeneFamily = one.getGeneFamily;
    getGeneFamilyAssignment = one.getGeneFamilyAssignment;
    getGeneFamilyTally = one.getGeneFamilyTally;
    getGeneFlankingRegion = one.getGeneFlankingRegion;
    getGeneticMap = one.getGeneticMap;
    getGeneticMarker = one.getGeneticMarker;
    getGenotypingPlatform = one.getGenotypingPlatform;
    getGWAS = one.getGWAS;
    getGWASResult = one.getGWASResult;
    getIntergenicRegion = one.getIntergenicRegion;
    getIntron = one.getIntron;
    getLinkageGroup = one.getLinkageGroup;
    getLinkageGroupPosition = one.getLinkageGroupPosition;
    getLocation = one.getLocation;
    getMRNA = one.getMRNA;
    getNewick = one.getNewick;
    getOntology = one.getOntology;
    getOntologyAnnotation = one.getOntologyAnnotation;
    getOntologyRelation = one.getOntologyRelation;
    getOntologyTerm = one.getOntologyTerm;
    getOntologyTermSynonym = one.getOntologyTermSynonym;
    getPanGeneSet = one.getPanGeneSet;
    getPathway = one.getPathway;
    getPhylonode = one.getPhylonode;
    getPhylotree = one.getPhylotree;
    getProtein = one.getProtein;
    getProteinDomain = one.getProteinDomain;
    getProteinMatch = one.getProteinMatch;
    getQTL = one.getQTL;
    getQTLStudy = one.getQTLStudy;
    getSequence = one.getSequence;
    getSequenceFeature = one.getSequenceFeature;
    getSequenceOntologyTerm = one.getSequenceOntologyTerm;
    getSupercontig = one.getSupercontig;
    getSyntenicRegion = one.getSyntenicRegion;
    getSyntenyBlock = one.getSyntenyBlock;
    getTrait = one.getTrait;
    getTranscript = one.getTranscript;
    getUTR = one.getUTR;

    // get-many (getX(identifiers[]) -> list)
    getGenes = getGenes;
    getPanGenePairs = getPanGenePairs;
    // relationship (getXsForY -> paginated list)
    getAdjacentGenesForIntergenicRegion =
      rel.getAdjacentGenesForIntergenicRegion;
    getAuthorsForPublication = rel.getAuthorsForPublication;
    getCDSsForTranscript = rel.getCDSsForTranscript;
    getChildrenForPhylonode = rel.getChildrenForPhylonode;
    getDataSetsForAnnotatable = rel.getDataSetsForAnnotatable;
    getDataSetsForDataSource = rel.getDataSetsForDataSource;
    getDataSetsForLocation = rel.getDataSetsForLocation;
    getDataSetsForOntology = rel.getDataSetsForOntology;
    getDataSetsForOntologyAnnotation = rel.getDataSetsForOntologyAnnotation;
    getDataSetsForOntologyTerm = rel.getDataSetsForOntologyTerm;
    getDataSetsForOrganism = rel.getDataSetsForOrganism;
    getDataSetsForStrain = rel.getDataSetsForStrain;
    getExonsForTranscript = rel.getExonsForTranscript;
    getExpressionSamplesForExpressionSource =
      rel.getExpressionSamplesForExpressionSource;
    getGeneFamilyAssignmentsForGene = rel.getGeneFamilyAssignmentsForGene;
    getGeneFamilyAssignmentsForProtein = rel.getGeneFamilyAssignmentsForProtein;
    getGeneFamilyTalliesForGeneFamily = rel.getGeneFamilyTalliesForGeneFamily;
    getGeneFlankingRegionsForGene = rel.getGeneFlankingRegionsForGene;
    getGenesForGeneFamily = rel.getGenesForGeneFamily;
    getGenesForGeneFunction = rel.getGenesForGeneFunction;
    getGenesForIntron = rel.getGenesForIntron;
    getGenesForPanGeneSet = rel.getGenesForPanGeneSet;
    getGenesForPathway = rel.getGenesForPathway;
    getGenesForProtein = rel.getGenesForProtein;
    getGenesForProteinDomain = rel.getGenesForProteinDomain;
    getGenesForQTL = rel.getGenesForQTL;
    getGeneticMarkersForGenotypingPlatform =
      rel.getGeneticMarkersForGenotypingPlatform;
    getGeneticMarkersForGWASResult = rel.getGeneticMarkersForGWASResult;
    getGeneticMarkersForQTL = rel.getGeneticMarkersForQTL;
    getGenotypingPlatformsForGeneticMarker =
      rel.getGenotypingPlatformsForGeneticMarker;
    getIntronsForGene = rel.getIntronsForGene;
    getIntronsForTranscript = rel.getIntronsForTranscript;
    getLinkageGroupPositionsForGeneticMarker =
      rel.getLinkageGroupPositionsForGeneticMarker;
    getLinkageGroupsForGeneticMap = rel.getLinkageGroupsForGeneticMap;
    getLocatedFeaturesForBioEntity = rel.getLocatedFeaturesForBioEntity;
    getLocationsForBioEntity = rel.getLocationsForBioEntity;
    getOntologyAnnotationsForAnnotatable =
      rel.getOntologyAnnotationsForAnnotatable;
    getOntologyAnnotationsForOntologyTerm =
      rel.getOntologyAnnotationsForOntologyTerm;
    getOntologyRelationsForOntologyTerm =
      rel.getOntologyRelationsForOntologyTerm;
    getOntologyTermsForTrait = rel.getOntologyTermsForTrait;
    getOntologyTermSynonymsForOntologyTerm =
      rel.getOntologyTermSynonymsForOntologyTerm;
    getPanGeneSetsForGene = rel.getPanGeneSetsForGene;
    getPanGeneSetsForProtein = rel.getPanGeneSetsForProtein;
    getPanGeneSetsForTranscript = rel.getPanGeneSetsForTranscript;
    getParentsForOntologyTerm = rel.getParentsForOntologyTerm;
    getPathwaysForGene = rel.getPathwaysForGene;
    getPhylonodesForPhylotree = rel.getPhylonodesForPhylotree;
    getProteinDomainsForGene = rel.getProteinDomainsForGene;
    getProteinDomainsForGeneFamily = rel.getProteinDomainsForGeneFamily;
    getProteinMatchesForProtein = rel.getProteinMatchesForProtein;
    getProteinsForGene = rel.getProteinsForGene;
    getProteinsForGeneFamily = rel.getProteinsForGeneFamily;
    getProteinsForPanGeneSet = rel.getProteinsForPanGeneSet;
    getPublicationsForAnnotatable = rel.getPublicationsForAnnotatable;
    getPublicationsForAuthor = rel.getPublicationsForAuthor;
    getPublicationsForDataSource = rel.getPublicationsForDataSource;
    getQTLsForGeneticMarker = rel.getQTLsForGeneticMarker;
    getQTLsForLinkageGroup = rel.getQTLsForLinkageGroup;
    getQTLsForQTLStudy = rel.getQTLsForQTLStudy;
    getQTLsForTrait = rel.getQTLsForTrait;
    getStrainsForOrganism = rel.getStrainsForOrganism;
    getSyntenicRegionsForSyntenyBlock = rel.getSyntenicRegionsForSyntenyBlock;
    getTranscriptsForExon = rel.getTranscriptsForExon;
    getTranscriptsForGene = rel.getTranscriptsForGene;
    getTranscriptsForIntron = rel.getTranscriptsForIntron;
    getTranscriptsForPanGeneSet = rel.getTranscriptsForPanGeneSet;
    getTranscriptsForUTR = rel.getTranscriptsForUTR;
    getUTRsForTranscript = rel.getUTRsForTranscript;
    getChildFeaturesForProteinDomain = rel.getChildFeaturesForProteinDomain;
    getParentFeaturesForProteinDomain = rel.getParentFeaturesForProteinDomain;
    getCrossReferencesForOntologyTerm = rel.getCrossReferencesForOntologyTerm;
    getParentsForSequenceOntologyTerm = rel.getParentsForSequenceOntologyTerm;
    getChildFeaturesForSequenceFeature = rel.getChildFeaturesForSequenceFeature;
    getOverlappingFeaturesForSequenceFeature =
      rel.getOverlappingFeaturesForSequenceFeature;
    getSynonymsForGeneFunction = rel.getSynonymsForGeneFunction;
    getGWASResultsForGWAS = rel.getGWASResultsForGWAS;
    getGWASResultsForGeneticMarker = rel.getGWASResultsForGeneticMarker;
    getGWASResultsForTrait = rel.getGWASResultsForTrait;
    getGWASForTrait = rel.getGWASForTrait;
    getQTLStudyForTrait = rel.getQTLStudyForTrait;
    getTraitsForGeneFunction = rel.getTraitsForGeneFunction;
    // search (faceted) + get-many faceted
    searchExpressionSamples = srch.searchExpressionSamples;
    searchExpressionSources = srch.searchExpressionSources;
    searchExpressionValues = srch.searchExpressionValues;
    searchGeneFamilies = srch.searchGeneFamilies;
    searchGeneticMaps = srch.searchGeneticMaps;
    searchGWASes = srch.searchGWASes;
    searchOntologyTerms = srch.searchOntologyTerms;
    searchOrganisms = srch.searchOrganisms;
    searchProteins = srch.searchProteins;
    searchProteinDomains = srch.searchProteinDomains;
    searchPublications = srch.searchPublications;
    searchQTLs = srch.searchQTLs;
    searchQTLStudies = srch.searchQTLStudies;
    searchStrains = srch.searchStrains;
    searchTraits = srch.searchTraits;
    getChromosomes = srch.getChromosomes;
    getGeneFamilies = srch.getGeneFamilies;
  }
  return ApiMixinClass;
}
