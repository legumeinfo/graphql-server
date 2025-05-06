import {IntermineServer} from '../intermine.server.js';

// author
import {getAuthor} from './get-author.js';
import {getAuthorsForPublication} from './get-authors.js';
// cds
import {getCDS} from './get-cds.js';
import {getCDSsForTranscript} from './get-cdss.js';
// chromosome
import {getChromosome} from './get-chromosome.js';
import {getChromosomes} from './get-chromosomes.js';
// data set
import {getDataSet} from './get-data-set.js';
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
import {getDataSource} from './get-data-source.js';
// exon
import {getExon} from './get-exon.js';
import {getExonsForTranscript} from './get-exons.js';
// expression sample
import {getExpressionSample} from './get-expression-sample.js';
import {getExpressionSamplesForExpressionSource} from './get-expression-samples.js';
import {searchExpressionSamples} from './search-expression-samples.js';
// expression source
import {getExpressionSource} from './get-expression-source.js';
import {searchExpressionSources} from './search-expression-sources.js';
// expression value
import {getExpressionValue} from './get-expression-value.js';
import {searchExpressionValues} from './search-expression-values.js';
// genes
import {getGene, getGenes} from './get-gene.js';
import {
  getGenesForGeneFamily,
  getGenesForIntron,
  getGenesForPanGeneSet,
  getGenesForPathway,
  getGenesForProtein,
  getGenesForProteinDomain,
  getAdjacentGenesForIntergenicRegion,
  getGenesForQTL,
} from './get-genes.js';
import {searchGenes} from './search-genes.js';
// gene family
import {getGeneFamily} from './get-gene-family.js';
import {getGeneFamilies} from './get-gene-families.js';
import {searchGeneFamilies} from './search-gene-families.js';
// gene family assignment
import {getGeneFamilyAssignment} from './get-gene-family-assignment.js';
import {
  getGeneFamilyAssignmentsForGene,
  getGeneFamilyAssignmentsForProtein,
} from './get-gene-family-assignments.js';
// gene family tally
import {getGeneFamilyTally} from './get-gene-family-tally.js';
import {getGeneFamilyTalliesForGeneFamily} from './get-gene-family-tallies.js';
// gene flanking regino
import {getGeneFlankingRegion} from './get-gene-flanking-region.js';
import {getGeneFlankingRegionsForGene} from './get-gene-flanking-regions.js';
// genetic map
import {getGeneticMap} from './get-genetic-map.js';
import {searchGeneticMaps} from './search-genetic-maps.js';
// genetic marker
import {getGeneticMarker} from './get-genetic-marker.js';
import {
  getGeneticMarkersForGenotypingPlatform,
  getGeneticMarkersForQTL,
  getGeneticMarkersForGWASResult,
} from './get-genetic-markers.js';
// genotyping platform
import {getGenotypingPlatform} from './get-genotyping-platform.js';
import {getGenotypingPlatformsForGeneticMarker} from './get-genotyping-platforms.js';
// gwas
import {getGWAS} from './get-gwas.js';
import {searchGWASes} from './search-gwases.js';
// gwas result
import {getGWASResult} from './get-gwas-result.js';
import {
  getGWASResultsForGeneticMarker,
  getGWASResultsForGWAS,
  getGWASResultsForTrait,
} from './get-gwas-results.js';
// intergenic region
import {getIntergenicRegion} from './get-intergenic-region.js';
// intron
import {getIntron} from './get-intron.js';
import {getIntronsForGene, getIntronsForTranscript} from './get-introns.js';
// linkage group
import {getLinkageGroup} from './get-linkage-group.js';
import {getLinkageGroupsForGeneticMap} from './get-linkage-groups.js';
// linkage group position
import {getLinkageGroupPosition} from './get-linkage-group-position.js';
import {getLinkageGroupPositionsForGeneticMarker} from './get-linkage-group-positions.js';
// location
import {getLocation} from './get-location.js';
import {
  getLocationsForBioEntity,
  getLocatedFeaturesForBioEntity,
} from './get-locations.js';
// mRNA
import {getMRNA} from './get-mrna.js';
// newick
import {getNewick} from './get-newick.js';
// ontology
import {getOntology} from './get-ontology.js';
// ontology annotation
import {getOntologyAnnotation} from './get-ontology-annotation.js';
import {
  getOntologyAnnotationsForAnnotatable,
  getOntologyAnnotationsForOntologyTerm,
} from './get-ontology-annotations.js';
// ontology relation
import {getOntologyRelation} from './get-ontology-relation.js';
import {getOntologyRelationsForOntologyTerm} from './get-ontology-relations.js';
// ontology term
import {getOntologyTerm} from './get-ontology-term.js';
import {
  getOntologyTermsForTrait,
  getParentsForOntologyTerm,
  getParentsForSequenceOntologyTerm,
  getCrossReferencesForOntologyTerm,
} from './get-ontology-terms.js';
import {searchOntologyTerms} from './search-ontology-terms.js';
// ontology term synonym
import {getOntologyTermSynonym} from './get-ontology-term-synonym.js';
import {getOntologyTermSynonymsForOntologyTerm} from './get-ontology-term-synonyms.js';
// organism
import {getOrganism} from './get-organism.js';
import {searchOrganisms} from './search-organisms.js';
// pan genes
import {getPanGenePairs} from './get-pan-gene-pairs.js';
// pan gene set
import {getPanGeneSet} from './get-pan-gene-set.js';
import {
  getPanGeneSetsForGene,
  getPanGeneSetsForTranscript,
  getPanGeneSetsForProtein,
} from './get-pan-gene-sets.js';
// pathway
import {getPathway} from './get-pathway.js';
import {getPathwaysForGene} from './get-pathways.js';
// phylonode
import {getPhylonode} from './get-phylonode.js';
import {
  getChildrenForPhylonode,
  getPhylonodesForPhylotree,
} from './get-phylonodes.js';
// phylotree
import {getPhylotree} from './get-phylotree.js';
// protein
import {getProtein} from './get-protein.js';
import {
  getProteinsForGene,
  getProteinsForGeneFamily,
  getProteinsForPanGeneSet,
} from './get-proteins.js';
import {searchProteins} from './search-proteins.js';
// protein domain
import {getProteinDomain} from './get-protein-domain.js';
import {
  getProteinDomainsForGene,
  getProteinDomainsForGeneFamily,
  getChildFeaturesForProteinDomain,
  getParentFeaturesForProteinDomain,
} from './get-protein-domains.js';
import {searchProteinDomains} from './search-protein-domains.js';
// protein match
import {getProteinMatch} from './get-protein-match.js';
import {getProteinMatchesForProtein} from './get-protein-matches.js';
// publication
import {getPublication} from './get-publication.js';
import {
  getPublicationsForAnnotatable,
  getPublicationsForAuthor,
  getPublicationsForDataSource,
} from './get-publications.js';
import {searchPublications} from './search-publications.js';
// qtl
import {getQTL} from './get-qtl.js';
import {
  getQTLsForGeneticMarker,
  getQTLsForLinkageGroup,
  getQTLsForTrait,
  getQTLsForQTLStudy,
} from './get-qtls.js';
import {searchQTLs} from './search-qtls.js';
// qtl study
import {getQTLStudy, getQTLStudyForTrait} from './get-qtl-study.js';
import {searchQTLStudies} from './search-qtl-studies.js';
// sequence
import {getSequence} from './get-sequence.js';
// sequence feature
import {getSequenceFeature} from './get-sequence-feature.js';
import {
  getChildFeaturesForSequenceFeature,
  getOverlappingFeaturesForSequenceFeature,
} from './get-sequence-features.js';
// SO term
import {getSequenceOntologyTerm} from './get-sequence-ontology-term.js';
// supercontig
import {getSupercontig} from './get-supercontig.js';
// syntenic region
import {getSyntenicRegion} from './get-syntenic-region.js';
import {getSyntenicRegionsForSyntenyBlock} from './get-syntenic-regions.js';
// synteny block
import {getSyntenyBlock} from './get-synteny-block.js';
// strain
import {getStrain} from './get-strain.js';
import {getStrainsForOrganism} from './get-strains.js';
import {searchStrains} from './search-strains.js';
// trait
import {getTrait} from './get-trait.js';
import {searchTraits} from './search-traits.js';
// transcripts
import {getTranscript} from './get-transcript.js';
import {
  getTranscriptsForExon,
  getTranscriptsForGene,
  getTranscriptsForIntron,
  getTranscriptsForPanGeneSet,
  getTranscriptsForUTR,
} from './get-transcripts.js';
// utr
import {getUTR} from './get-utr.js';
import {getUTRsForTranscript} from './get-utrs.js';
// mine web properties
import {getMineWebProperties} from './get-mine-web-properties.js';

// the constructor used to type constrain the super class
export type ApiBaseConstructor<T = IntermineServer> = new (...args: any[]) => T;

// the interface of the class generated by the mixin
export declare class ApiMixinInterface {
  verifyIntermineVersion: () => void;
  // author
  getAuthor: typeof getAuthor;
  getAuthorsForPublication: typeof getAuthorsForPublication;
  // cds
  getCDS: typeof getCDS;
  getCDSsForTranscript: typeof getCDSsForTranscript;
  // chromosome
  getChromosome: typeof getChromosome;
  getChromosomes: typeof getChromosomes;
  // data set
  getDataSet: typeof getDataSet;
  getDataSetsForAnnotatable: typeof getDataSetsForAnnotatable;
  getDataSetsForDataSource: typeof getDataSetsForDataSource;
  getDataSetsForLocation: typeof getDataSetsForLocation;
  getDataSetsForOntology: typeof getDataSetsForOntology;
  getDataSetsForOntologyAnnotation: typeof getDataSetsForOntologyAnnotation;
  getDataSetsForOntologyTerm: typeof getDataSetsForOntologyTerm;
  getDataSetsForOrganism: typeof getDataSetsForOrganism;
  getDataSetsForStrain: typeof getDataSetsForStrain;
  // data source
  getDataSource: typeof getDataSource;
  // exon
  getExon: typeof getExon;
  getExonsForTranscript: typeof getExonsForTranscript;
  // expression sample
  getExpressionSample: typeof getExpressionSample;
  getExpressionSamplesForExpressionSource: typeof getExpressionSamplesForExpressionSource;
  searchExpressionSamples: typeof searchExpressionSamples;
  // expression source
  getExpressionSource: typeof getExpressionSource;
  searchExpressionSources: typeof searchExpressionSources;
  // expression value
  getExpressionValue: typeof getExpressionValue;
  searchExpressionValues: typeof searchExpressionValues;
  // genes
  getGene: typeof getGene;
  getGenes: typeof getGenes;
  getGenesForGeneFamily: typeof getGenesForGeneFamily;
  getGenesForIntron: typeof getGenesForIntron;
  getGenesForPanGeneSet: typeof getGenesForPanGeneSet;
  getGenesForPathway: typeof getGenesForPathway;
  getGenesForProtein: typeof getGenesForProtein;
  getGenesForProteinDomain: typeof getGenesForProteinDomain;
  getAdjacentGenesForIntergenicRegion: typeof getAdjacentGenesForIntergenicRegion;
  getGenesForQTL: typeof getGenesForQTL;
  searchGenes: typeof searchGenes;
  // gene family
  getGeneFamily: typeof getGeneFamily;
  getGeneFamilies: typeof getGeneFamilies;
  searchGeneFamilies: typeof searchGeneFamilies;
  // gene family assignment
  getGeneFamilyAssignment: typeof getGeneFamilyAssignment;
  getGeneFamilyAssignmentsForGene: typeof getGeneFamilyAssignmentsForGene;
  getGeneFamilyAssignmentsForProtein: typeof getGeneFamilyAssignmentsForProtein;
  // gene family tally
  getGeneFamilyTally: typeof getGeneFamilyTally;
  getGeneFamilyTalliesForGeneFamily: typeof getGeneFamilyTalliesForGeneFamily;
  // gene flanking region
  getGeneFlankingRegion: typeof getGeneFlankingRegion;
  getGeneFlankingRegionsForGene: typeof getGeneFlankingRegionsForGene;
  // genetic map
  getGeneticMap: typeof getGeneticMap;
  searchGeneticMaps: typeof searchGeneticMaps;
  // genetic marker
  getGeneticMarker: typeof getGeneticMarker;
  getGeneticMarkersForGenotypingPlatform: typeof getGeneticMarkersForGenotypingPlatform;
  getGeneticMarkersForQTL: typeof getGeneticMarkersForQTL;
  getGeneticMarkersForGWASResult: typeof getGeneticMarkersForGWASResult;
  // genotyping platform
  getGenotypingPlatform: typeof getGenotypingPlatform;
  getGenotypingPlatformsForGeneticMarker: typeof getGenotypingPlatformsForGeneticMarker;
  // gwas
  getGWAS: typeof getGWAS;
  searchGWASes: typeof searchGWASes;
  // gwas result
  getGWASResult: typeof getGWASResult;
  getGWASResultsForGeneticMarker: typeof getGWASResultsForGeneticMarker;
  getGWASResultsForGWAS: typeof getGWASResultsForGWAS;
  getGWASResultsForTrait: typeof getGWASResultsForTrait;
  // intergenic region
  getIntergenicRegion: typeof getIntergenicRegion;
  // intron
  getIntron: typeof getIntron;
  getIntronsForGene: typeof getIntronsForGene;
  getIntronsForTranscript: typeof getIntronsForTranscript;
  // linkage group
  getLinkageGroup: typeof getLinkageGroup;
  getLinkageGroupsForGeneticMap: typeof getLinkageGroupsForGeneticMap;
  // linkage group position
  getLinkageGroupPosition: typeof getLinkageGroupPosition;
  getLinkageGroupPositionsForGeneticMarker: typeof getLinkageGroupPositionsForGeneticMarker;
  // location
  getLocation: typeof getLocation;
  getLocationsForBioEntity: typeof getLocationsForBioEntity;
  getLocatedFeaturesForBioEntity: typeof getLocatedFeaturesForBioEntity;
  // mRNA
  getMRNA: typeof getMRNA;
  // newick
  getNewick: typeof getNewick;
  // ontology
  getOntology: typeof getOntology;
  // ontology annotation
  getOntologyAnnotation: typeof getOntologyAnnotation;
  getOntologyAnnotationsForAnnotatable: typeof getOntologyAnnotationsForAnnotatable;
  getOntologyAnnotationsForOntologyTerm: typeof getOntologyAnnotationsForOntologyTerm;
  // ontology relation
  getOntologyRelation: typeof getOntologyRelation;
  getOntologyRelationsForOntologyTerm: typeof getOntologyRelationsForOntologyTerm;
  // ontology term
  getOntologyTerm: typeof getOntologyTerm;
  getOntologyTermsForTrait: typeof getOntologyTermsForTrait;
  getParentsForOntologyTerm: typeof getParentsForOntologyTerm;
  getParentsForSequenceOntologyTerm: typeof getParentsForSequenceOntologyTerm;
  getCrossReferencesForOntologyTerm: typeof getCrossReferencesForOntologyTerm;
  searchOntologyTerms: typeof searchOntologyTerms;
  // ontology term synonym
  getOntologyTermSynonym: typeof getOntologyTermSynonym;
  getOntologyTermSynonymsForOntologyTerm: typeof getOntologyTermSynonymsForOntologyTerm;
  // organism
  getOrganism: typeof getOrganism;
  searchOrganisms: typeof searchOrganisms;
  // pan genes
  getPanGenePairs: typeof getPanGenePairs;
  // pan-gene set
  getPanGeneSet: typeof getPanGeneSet;
  getPanGeneSetsForGene: typeof getPanGeneSetsForGene;
  getPanGeneSetsForTranscript: typeof getPanGeneSetsForTranscript;
  getPanGeneSetsForProtein: typeof getPanGeneSetsForProtein;
  // pathway
  getPathway: typeof getPathway;
  getPathwaysForGene: typeof getPathwaysForGene;
  // phylonode
  getPhylonode: typeof getPhylonode;
  getChildrenForPhylonode: typeof getChildrenForPhylonode;
  getPhylonodesForPhylotree: typeof getPhylonodesForPhylotree;
  // phylotree
  getPhylotree: typeof getPhylotree;
  // protein
  getProtein: typeof getProtein;
  getProteinsForGene: typeof getProteinsForGene;
  getProteinsForGeneFamily: typeof getProteinsForGeneFamily;
  getProteinsForPanGeneSet: typeof getProteinsForPanGeneSet;
  searchProteins: typeof searchProteins;
  // protein domain
  getProteinDomain: typeof getProteinDomain;
  getProteinDomainsForGene: typeof getProteinDomainsForGene;
  getProteinDomainsForGeneFamily: typeof getProteinDomainsForGeneFamily;
  getChildFeaturesForProteinDomain: typeof getChildFeaturesForProteinDomain;
  getParentFeaturesForProteinDomain: typeof getParentFeaturesForProteinDomain;
  searchProteinDomains: typeof searchProteinDomains;
  // protein match
  getProteinMatch: typeof getProteinMatch;
  getProteinMatchesForProtein: typeof getProteinMatchesForProtein;
  // publication
  getPublication: typeof getPublication;
  getPublicationsForAnnotatable: typeof getPublicationsForAnnotatable;
  getPublicationsForAuthor: typeof getPublicationsForAuthor;
  getPublicationsForDataSource: typeof getPublicationsForDataSource;
  searchPublications: typeof searchPublications;
  // qtl
  getQTL: typeof getQTL;
  getQTLsForGeneticMarker: typeof getQTLsForGeneticMarker;
  getQTLsForLinkageGroup: typeof getQTLsForLinkageGroup;
  getQTLsForTrait: typeof getQTLsForTrait;
  getQTLsForQTLStudy: typeof getQTLsForQTLStudy;
  searchQTLs: typeof searchQTLs;
  // qtl study
  getQTLStudy: typeof getQTLStudy;
  getQTLStudyForTrait: typeof getQTLStudyForTrait;
  searchQTLStudies: typeof searchQTLStudies;
  // sequence
  getSequence: typeof getSequence;
  // sequence feature
  getSequenceFeature: typeof getSequenceFeature;
  getChildFeaturesForSequenceFeature: typeof getChildFeaturesForSequenceFeature;
  getOverlappingFeaturesForSequenceFeature: typeof getOverlappingFeaturesForSequenceFeature;
  // SO term
  getSequenceOntologyTerm: typeof getSequenceOntologyTerm;
  // supercontig
  getSupercontig: typeof getSupercontig;
  // syntenic region
  getSyntenicRegion: typeof getSyntenicRegion;
  getSyntenicRegionsForSyntenyBlock: typeof getSyntenicRegionsForSyntenyBlock;
  // synteny block
  getSyntenyBlock: typeof getSyntenyBlock;
  // strain
  getStrain: typeof getStrain;
  getStrainsForOrganism: typeof getStrainsForOrganism;
  searchStrains: typeof searchStrains;
  // trait
  getTrait: typeof getTrait;
  searchTraits: typeof searchTraits;
  // transcript
  getTranscript: typeof getTranscript;
  getTranscriptsForExon: typeof getTranscriptsForExon;
  getTranscriptsForGene: typeof getTranscriptsForGene;
  getTranscriptsForIntron: typeof getTranscriptsForIntron;
  getTranscriptsForPanGeneSet: typeof getTranscriptsForPanGeneSet;
  getTranscriptsForUTR: typeof getTranscriptsForUTR;
  // UTR
  getUTR: typeof getUTR;
  getUTRsForTranscript: typeof getUTRsForTranscript;
  // mine web properties
  getMineWebProperties: typeof getMineWebProperties;
}

// a mixin that adds the API to the IntermineServer class
export const ApiMixin = <T extends ApiBaseConstructor<IntermineServer>>(
  superClass: T,
) => {
  class ApiMixinClass extends superClass {
    static intermineVersion = '5.1.0.4';

    // Verifies that the version of the IntermineServer is the version the API is expecting
    async verifyIntermineVersion() {
      const properties = await this.webProperties();
      const serverVersion = properties['web-properties'].project.releaseVersion;
      if (serverVersion != ApiMixinClass.intermineVersion) {
        console.warn(
          `data-sources: intermine: ${this.baseURL} has version ${serverVersion}; expected ${ApiMixinClass.intermineVersion}`,
        );
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
    getChromosomes = getChromosomes;
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
    getExpressionSamplesForExpressionSource =
      getExpressionSamplesForExpressionSource;
    searchExpressionSamples = searchExpressionSamples;
    // expression source
    getExpressionSource = getExpressionSource;
    searchExpressionSources = searchExpressionSources;
    // expression value
    getExpressionValue = getExpressionValue;
    searchExpressionValues = searchExpressionValues;
    // genes
    getGene = getGene;
    getGenes = getGenes;
    getGenesForGeneFamily = getGenesForGeneFamily;
    getGenesForIntron = getGenesForIntron;
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
    getGeneFamilyAssignmentsForGene = getGeneFamilyAssignmentsForGene;
    getGeneFamilyAssignmentsForProtein = getGeneFamilyAssignmentsForProtein;
    // gene family tally
    getGeneFamilyTally = getGeneFamilyTally;
    getGeneFamilyTalliesForGeneFamily = getGeneFamilyTalliesForGeneFamily;
    // gene flanking region
    getGeneFlankingRegion = getGeneFlankingRegion;
    getGeneFlankingRegionsForGene = getGeneFlankingRegionsForGene;
    // genetic map
    getGeneticMap = getGeneticMap;
    searchGeneticMaps = searchGeneticMaps;
    // genetic marker
    getGeneticMarker = getGeneticMarker;
    getGeneticMarkersForGenotypingPlatform =
      getGeneticMarkersForGenotypingPlatform;
    getGeneticMarkersForQTL = getGeneticMarkersForQTL;
    getGeneticMarkersForGWASResult = getGeneticMarkersForGWASResult;
    // genotyping platform
    getGenotypingPlatform = getGenotypingPlatform;
    getGenotypingPlatformsForGeneticMarker =
      getGenotypingPlatformsForGeneticMarker;
    // gwas
    getGWAS = getGWAS;
    searchGWASes = searchGWASes;
    // gwas result
    getGWASResult = getGWASResult;
    getGWASResultsForGeneticMarker = getGWASResultsForGeneticMarker;
    getGWASResultsForGWAS = getGWASResultsForGWAS;
    getGWASResultsForTrait = getGWASResultsForTrait;
    // intergenic region
    getIntergenicRegion = getIntergenicRegion;
    // intron
    getIntron = getIntron;
    getIntronsForGene = getIntronsForGene;
    getIntronsForTranscript = getIntronsForTranscript;
    // linkage group
    getLinkageGroup = getLinkageGroup;
    getLinkageGroupsForGeneticMap = getLinkageGroupsForGeneticMap;
    // linkage group position
    getLinkageGroupPosition = getLinkageGroupPosition;
    getLinkageGroupPositionsForGeneticMarker =
      getLinkageGroupPositionsForGeneticMarker;
    // location
    getLocation = getLocation;
    getLocationsForBioEntity = getLocationsForBioEntity;
    getLocatedFeaturesForBioEntity = getLocatedFeaturesForBioEntity;
    // mRNA
    getMRNA = getMRNA;
    // newick
    getNewick = getNewick;
    // ontology
    getOntology = getOntology;
    // ontology annotation
    getOntologyAnnotation = getOntologyAnnotation;
    getOntologyAnnotationsForAnnotatable = getOntologyAnnotationsForAnnotatable;
    getOntologyAnnotationsForOntologyTerm =
      getOntologyAnnotationsForOntologyTerm;
    // ontology relation
    getOntologyRelation = getOntologyRelation;
    getOntologyRelationsForOntologyTerm = getOntologyRelationsForOntologyTerm;
    // ontology term
    getOntologyTerm = getOntologyTerm;
    getOntologyTermsForTrait = getOntologyTermsForTrait;
    getParentsForOntologyTerm = getParentsForOntologyTerm;
    getParentsForSequenceOntologyTerm = getParentsForSequenceOntologyTerm;
    getCrossReferencesForOntologyTerm = getCrossReferencesForOntologyTerm;
    searchOntologyTerms = searchOntologyTerms;
    // ontology term synonym
    getOntologyTermSynonym = getOntologyTermSynonym;
    getOntologyTermSynonymsForOntologyTerm =
      getOntologyTermSynonymsForOntologyTerm;
    // organism
    getOrganism = getOrganism;
    searchOrganisms = searchOrganisms;
    // pan-genes
    getPanGenePairs = getPanGenePairs;
    // pan-gene set
    getPanGeneSet = getPanGeneSet;
    getPanGeneSetsForGene = getPanGeneSetsForGene;
    getPanGeneSetsForTranscript = getPanGeneSetsForTranscript;
    getPanGeneSetsForProtein = getPanGeneSetsForProtein;
    // pathway
    getPathway = getPathway;
    getPathwaysForGene = getPathwaysForGene;
    // phylonode
    getPhylonode = getPhylonode;
    getChildrenForPhylonode = getChildrenForPhylonode;
    getPhylonodesForPhylotree = getPhylonodesForPhylotree;
    // phylotree
    getPhylotree = getPhylotree;
    // protein
    getProtein = getProtein;
    getProteinsForGene = getProteinsForGene;
    getProteinsForGeneFamily = getProteinsForGeneFamily;
    getProteinsForPanGeneSet = getProteinsForPanGeneSet;
    searchProteins = searchProteins;
    // protein domain
    getProteinDomain = getProteinDomain;
    getProteinDomainsForGene = getProteinDomainsForGene;
    getProteinDomainsForGeneFamily = getProteinDomainsForGeneFamily;
    getChildFeaturesForProteinDomain = getChildFeaturesForProteinDomain;
    getParentFeaturesForProteinDomain = getParentFeaturesForProteinDomain;
    searchProteinDomains = searchProteinDomains;
    // protein match
    getProteinMatch = getProteinMatch;
    getProteinMatchesForProtein = getProteinMatchesForProtein;
    // publication
    getPublication = getPublication;
    getPublicationsForAnnotatable = getPublicationsForAnnotatable;
    getPublicationsForAuthor = getPublicationsForAuthor;
    getPublicationsForDataSource = getPublicationsForDataSource;
    searchPublications = searchPublications;
    // qtl
    getQTL = getQTL;
    getQTLsForGeneticMarker = getQTLsForGeneticMarker;
    getQTLsForLinkageGroup = getQTLsForLinkageGroup;
    getQTLsForTrait = getQTLsForTrait;
    getQTLsForQTLStudy = getQTLsForQTLStudy;
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
    getOverlappingFeaturesForSequenceFeature =
      getOverlappingFeaturesForSequenceFeature;
    // SO term
    getSequenceOntologyTerm = getSequenceOntologyTerm;
    // supercontig
    getSupercontig = getSupercontig;
    // syntenic region
    getSyntenicRegion = getSyntenicRegion;
    getSyntenicRegionsForSyntenyBlock = getSyntenicRegionsForSyntenyBlock;
    // synteny block
    getSyntenyBlock = getSyntenyBlock;
    // strain
    getStrain = getStrain;
    getStrainsForOrganism = getStrainsForOrganism;
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
