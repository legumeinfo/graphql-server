// relationships.ts — getXsForY methods: fetch a related, paginated collection for a
// parent id. Each is one forParent() line (root = the constraint path's first
// segment). Polymorphic returns (Location, Transcript) use the object attributes +
// objectTransform. Reuses the InterMine model modules and join factories verbatim.
// A handful with special view factories are ported individually below.
import {SqliteServer, ApiResponse, PageOpts} from '../sqlite.server.js';
import {
  forParent,
  outerPaths,
  objectTransform,
  graphqlPageInfo,
} from './helpers.js';
import * as M from '../../intermine/models/index.js';
import {sequenceFeatureJoinFactory} from '../../intermine/api/sequence-feature.js';
import {bioEntityJoinFactory} from '../../intermine/api/bio-entity.js';
import {geneJoinFactory} from '../../intermine/api/gene.js';
import {proteinJoinFactory} from '../../intermine/api/protein.js';

const sf = (root: string) => outerPaths(sequenceFeatureJoinFactory(root));

export const getAdjacentGenesForIntergenicRegion = forParent(
  'IntergenicRegion.id',
  M.intermineIntergenicRegionAdjacentGeneAttributes,
  M.intermineIntergenicRegionAdjacentGeneSort,
  M.response2genes,
  sf('IntergenicRegion.adjacentGenes'),
);
export const getAuthorsForPublication = forParent(
  'Author.publications.id',
  M.intermineAuthorAttributes,
  M.intermineAuthorSort,
  M.response2authors,
);
export const getCDSsForTranscript = forParent(
  'CDS.transcript.id',
  M.intermineCDSAttributes,
  M.intermineCDSSort,
  M.response2cdss,
  sf('CDS'),
);
export const getChildrenForPhylonode = forParent(
  'Phylonode.parent.id',
  M.interminePhylonodeAttributes,
  M.interminePhylonodeSort,
  M.response2phylonodes,
);
export const getDataSetsForAnnotatable = forParent(
  'DataSet.entities.id',
  M.intermineDataSetAttributes,
  M.intermineDataSetSort,
  M.response2dataSets,
);
export const getDataSetsForDataSource = forParent(
  'DataSet.dataSource.id',
  M.intermineDataSetAttributes,
  M.intermineDataSetSort,
  M.response2dataSets,
);
export const getDataSetsForLocation = forParent(
  'Location.id',
  M.intermineLocationDataSetAttributes,
  M.intermineLocationDataSetSort,
  M.response2dataSets,
);
export const getDataSetsForOntology = forParent(
  'Ontology.id',
  M.intermineOntologyDataSetAttributes,
  M.intermineOntologyDataSetSort,
  M.response2dataSets,
);
export const getDataSetsForOntologyAnnotation = forParent(
  'OntologyAnnotation.id',
  M.intermineOntologyAnnotationDataSetAttributes,
  M.intermineOntologyAnnotationDataSetSort,
  M.response2dataSets,
);
export const getDataSetsForOntologyTerm = forParent(
  'OntologyTerm.id',
  M.intermineOntologyTermDataSetAttributes,
  M.intermineOntologyTermDataSetSort,
  M.response2dataSets,
);
export const getDataSetsForOrganism = forParent(
  'Organism.id',
  M.intermineOrganismDataSetAttributes,
  M.intermineOrganismDataSetSort,
  M.response2dataSets,
);
export const getDataSetsForStrain = forParent(
  'Strain.id',
  M.intermineStrainDataSetAttributes,
  M.intermineStrainDataSetSort,
  M.response2dataSets,
);
export const getExonsForTranscript = forParent(
  'Exon.transcripts.id',
  M.intermineExonAttributes,
  M.intermineExonSort,
  M.response2exons,
  sf('Exon'),
);
export const getExpressionSamplesForExpressionSource = forParent(
  'ExpressionSample.source.id',
  M.intermineExpressionSampleAttributes,
  M.intermineExpressionSampleSort,
  M.response2expressionSamples,
);
export const getGeneFamilyAssignmentsForGene = forParent(
  'Gene.id',
  M.intermineGeneGeneFamilyAssignmentsAttributes,
  M.intermineGeneGeneFamilyAssignmentsSort,
  M.response2geneFamilyAssignments,
);
export const getGeneFamilyAssignmentsForProtein = forParent(
  'Protein.id',
  M.intermineProteinGeneFamilyAssignmentsAttributes,
  M.intermineProteinGeneFamilyAssignmentsSort,
  M.response2geneFamilyAssignments,
);
export const getGeneFamilyTalliesForGeneFamily = forParent(
  'GeneFamilyTally.geneFamily.id',
  M.intermineGeneFamilyTallyAttributes,
  M.intermineGeneFamilyTallySort,
  M.response2geneFamilyTallies,
);
export const getGeneFlankingRegionsForGene = forParent(
  'GeneFlankingRegion.gene.id',
  M.intermineGeneFlankingRegionAttributes,
  M.intermineGeneFlankingRegionSort,
  M.response2geneFlankingRegions,
  sf('GeneFlankingRegion'),
);
export const getGenesForGeneFamily = forParent(
  'Gene.geneFamilyAssignments.geneFamily.id',
  M.intermineGeneAttributes,
  M.intermineGeneSort,
  M.response2genes,
  outerPaths(geneJoinFactory()),
);
export const getGenesForGeneFunction = forParent(
  'Gene.geneFunctions.id',
  M.intermineGeneAttributes,
  M.intermineGeneSort,
  M.response2genes,
  outerPaths(geneJoinFactory()),
);
export const getGenesForIntron = forParent(
  'Intron.id',
  M.intermineIntronGeneAttributes,
  M.intermineIntronGeneSort,
  M.response2genes,
  sf('Intron.genes'),
);
export const getGenesForPanGeneSet = forParent(
  'Gene.panGeneSets.id',
  M.intermineGeneAttributes,
  M.intermineGeneSort,
  M.response2genes,
  outerPaths(geneJoinFactory()),
);
export const getGenesForPathway = forParent(
  'Gene.pathways.id',
  M.intermineGeneAttributes,
  M.intermineGeneSort,
  M.response2genes,
  outerPaths(geneJoinFactory()),
);
export const getGenesForProtein = forParent(
  'Gene.proteins.id',
  M.intermineGeneAttributes,
  M.intermineGeneSort,
  M.response2genes,
  outerPaths(geneJoinFactory()),
);
export const getGenesForProteinDomain = forParent(
  'Gene.proteinDomains.id',
  M.intermineGeneAttributes,
  M.intermineGeneSort,
  M.response2genes,
  outerPaths(geneJoinFactory()),
);
export const getGenesForQTL = forParent(
  'QTL.id',
  M.intermineQTLGenesAttributes,
  M.intermineQTLGenesSort,
  M.response2genes,
  sf('QTL.genes'),
);
export const getGeneticMarkersForGenotypingPlatform = forParent(
  'GeneticMarker.genotypingPlatforms.id',
  M.intermineGeneticMarkerAttributes,
  M.intermineGeneticMarkerSort,
  M.response2geneticMarkers,
  sf('GeneticMarker'),
);
export const getGeneticMarkersForGWASResult = forParent(
  'GeneticMarker.gwasResults.id',
  M.intermineGeneticMarkerAttributes,
  M.intermineGeneticMarkerSort,
  M.response2geneticMarkers,
  sf('GeneticMarker'),
);
export const getGeneticMarkersForQTL = forParent(
  'GeneticMarker.qtls.id',
  M.intermineGeneticMarkerAttributes,
  M.intermineGeneticMarkerSort,
  M.response2geneticMarkers,
  sf('GeneticMarker'),
);
export const getGenotypingPlatformsForGeneticMarker = forParent(
  'GenotypingPlatform.markers.id',
  M.intermineGenotypingPlatformAttributes,
  M.intermineGenotypingPlatformSort,
  M.response2genotypingPlatforms,
);
export const getIntronsForGene = forParent(
  'Intron.genes.id',
  M.intermineIntronAttributes,
  M.intermineIntronSort,
  M.response2introns,
  sf('Intron'),
);
export const getIntronsForTranscript = forParent(
  'Intron.transcripts.id',
  M.intermineIntronAttributes,
  M.intermineIntronSort,
  M.response2introns,
  sf('Intron'),
);
export const getLinkageGroupPositionsForGeneticMarker = forParent(
  'GeneticMarker.id',
  M.intermineGeneticMarkerLinkageGroupPositionsAttributes,
  M.intermineGeneticMarkerLinkageGroupPositionsSort,
  M.response2linkageGroupPositions,
);
export const getLinkageGroupsForGeneticMap = forParent(
  'LinkageGroup.geneticMap.id',
  M.intermineLinkageGroupAttributes,
  M.intermineLinkageGroupSort,
  M.response2linkageGroups,
);
export const getLocatedFeaturesForBioEntity = forParent(
  'Location.locatedOn.primaryIdentifier',
  (M as any).intermineLocationObjectAttributes,
  M.intermineLocationSort,
  objectTransform(
    (M as any).intermineLocationObjectAttributes,
    (M as any).graphqlLocationAttributes,
  ),
);
export const getLocationsForBioEntity = forParent(
  'Location.feature.primaryIdentifier',
  (M as any).intermineLocationObjectAttributes,
  M.intermineLocationSort,
  objectTransform(
    (M as any).intermineLocationObjectAttributes,
    (M as any).graphqlLocationAttributes,
  ),
);
export const getOntologyAnnotationsForAnnotatable = forParent(
  'OntologyAnnotation.subject.id',
  M.intermineOntologyAnnotationAttributes,
  M.intermineOntologyAnnotationSort,
  M.response2ontologyAnnotations,
);
export const getOntologyAnnotationsForOntologyTerm = forParent(
  'OntologyAnnotation.ontologyTerm.id',
  M.intermineOntologyAnnotationAttributes,
  M.intermineOntologyAnnotationSort,
  M.response2ontologyAnnotations,
);
export const getOntologyRelationsForOntologyTerm = forParent(
  'OntologyTerm.id',
  M.intermineOntologyTermRelationAttributes,
  M.intermineOntologyTermRelationSort,
  M.response2ontologyRelations,
);
export const getOntologyTermsForTrait = forParent(
  'Trait.id',
  M.intermineOntologyTermAttributes,
  M.intermineOntologyTermSort,
  M.response2ontologyTerms,
);
export const getOntologyTermSynonymsForOntologyTerm = forParent(
  'OntologyTerm.id',
  M.intermineOntologyTermOntologyTermSynonymAttributes,
  M.intermineOntologyTermOntologyTermSynonymSort,
  M.response2ontologyTermSynonyms,
);
export const getPanGeneSetsForGene = forParent(
  'PanGeneSet.genes.id',
  M.interminePanGeneSetAttributes,
  M.interminePanGeneSetSort,
  M.response2panGeneSets,
);
export const getPanGeneSetsForProtein = forParent(
  'PanGeneSet.proteins.id',
  M.interminePanGeneSetAttributes,
  M.interminePanGeneSetSort,
  M.response2panGeneSets,
);
export const getPanGeneSetsForTranscript = forParent(
  'PanGeneSet.transcripts.id',
  M.interminePanGeneSetAttributes,
  M.interminePanGeneSetSort,
  M.response2panGeneSets,
);
export const getParentsForOntologyTerm = forParent(
  'OntologyTerm.id',
  M.intermineOntologyTermParentAttributes,
  M.intermineOntologyTermParentSort,
  M.response2ontologyTerms,
);
export const getPathwaysForGene = forParent(
  'Pathway.genes.id',
  M.interminePathwayAttributes,
  M.interminePathwaySort,
  M.response2pathways,
);
export const getPhylonodesForPhylotree = forParent(
  'Phylonode.tree.id',
  M.interminePhylonodeAttributes,
  M.interminePhylonodeSort,
  M.response2phylonodes,
);
export const getProteinDomainsForGene = forParent(
  'ProteinDomain.genes.id',
  M.intermineProteinDomainAttributes,
  M.intermineProteinDomainSort,
  M.response2proteinDomains,
);
export const getProteinDomainsForGeneFamily = forParent(
  'ProteinDomain.geneFamilies.id',
  M.intermineProteinDomainAttributes,
  M.intermineProteinDomainSort,
  M.response2proteinDomains,
);
export const getProteinMatchesForProtein = forParent(
  'ProteinMatch.protein.id',
  M.intermineProteinMatchAttributes,
  M.intermineProteinMatchSort,
  M.response2proteinMatches,
  outerPaths(bioEntityJoinFactory('ProteinMatch')),
);
export const getProteinsForGene = forParent(
  'Protein.genes.id',
  M.intermineProteinAttributes,
  M.intermineProteinSort,
  M.response2proteins,
  outerPaths(proteinJoinFactory()),
);
export const getProteinsForGeneFamily = forParent(
  'Protein.geneFamilyAssignments.geneFamily.id',
  M.intermineProteinAttributes,
  M.intermineProteinSort,
  M.response2proteins,
  outerPaths(proteinJoinFactory()),
);
export const getProteinsForPanGeneSet = forParent(
  'Protein.panGeneSets.id',
  M.intermineProteinAttributes,
  M.intermineProteinSort,
  M.response2proteins,
  outerPaths(proteinJoinFactory()),
);
export const getPublicationsForAnnotatable = forParent(
  'Publication.entities.id',
  M.interminePublicationAttributes,
  M.interminePublicationSort,
  M.response2publications,
);
export const getPublicationsForAuthor = forParent(
  'Publication.authors.id',
  M.interminePublicationAttributes,
  M.interminePublicationSort,
  M.response2publications,
);
export const getPublicationsForDataSource = forParent(
  'DataSource.id',
  M.interminePublicationAttributes,
  M.interminePublicationSort,
  M.response2publications,
);
export const getQTLsForGeneticMarker = forParent(
  'QTL.markers.id',
  M.intermineQTLAttributes,
  M.intermineQTLSort,
  M.response2qtls,
);
export const getQTLsForLinkageGroup = forParent(
  'QTL.linkageGroup.id',
  M.intermineQTLAttributes,
  M.intermineQTLSort,
  M.response2qtls,
);
export const getQTLsForQTLStudy = forParent(
  'QTL.qtlStudy.id',
  M.intermineQTLAttributes,
  M.intermineQTLSort,
  M.response2qtls,
);
export const getQTLsForTrait = forParent(
  'QTL.trait.id',
  M.intermineQTLAttributes,
  M.intermineQTLSort,
  M.response2qtls,
);
export const getStrainsForOrganism = forParent(
  'Strain.organism.id',
  M.intermineStrainAttributes,
  M.intermineStrainSort,
  M.response2strains,
);
export const getSyntenicRegionsForSyntenyBlock = forParent(
  'SyntenicRegion.syntenyBlock.id',
  M.intermineSyntenicRegionAttributes,
  M.intermineSyntenicRegionSort,
  M.response2syntenicRegions,
  sf('SyntenicRegion'),
);
export const getTranscriptsForExon = forParent(
  'Transcript.exons.id',
  (M as any).intermineTranscriptObjectAttributes,
  M.intermineTranscriptSort,
  objectTransform(
    (M as any).intermineTranscriptObjectAttributes,
    (M as any).graphqlTranscriptAttributes,
  ),
);
export const getTranscriptsForGene = forParent(
  'Transcript.gene.id',
  (M as any).intermineTranscriptObjectAttributes,
  M.intermineTranscriptSort,
  objectTransform(
    (M as any).intermineTranscriptObjectAttributes,
    (M as any).graphqlTranscriptAttributes,
  ),
);
export const getTranscriptsForIntron = forParent(
  'Transcript.introns.id',
  (M as any).intermineTranscriptObjectAttributes,
  M.intermineTranscriptSort,
  objectTransform(
    (M as any).intermineTranscriptObjectAttributes,
    (M as any).graphqlTranscriptAttributes,
  ),
);
export const getTranscriptsForPanGeneSet = forParent(
  'Transcript.panGeneSets.id',
  (M as any).intermineTranscriptObjectAttributes,
  M.intermineTranscriptSort,
  objectTransform(
    (M as any).intermineTranscriptObjectAttributes,
    (M as any).graphqlTranscriptAttributes,
  ),
);
export const getTranscriptsForUTR = forParent(
  'Transcript.UTRs.id',
  (M as any).intermineTranscriptObjectAttributes,
  M.intermineTranscriptSort,
  objectTransform(
    (M as any).intermineTranscriptObjectAttributes,
    (M as any).graphqlTranscriptAttributes,
  ),
);
export const getUTRsForTranscript = forParent(
  'UTR.transcripts.id',
  M.intermineUTRAttributes,
  M.intermineUTRSort,
  M.response2utrs,
  sf('UTR'),
);
// ---- simple methods deferred by the generator (shared-helper response) ----
export const getGWASResultsForGWAS = forParent(
  'GWASResult.gwas.id',
  M.intermineGWASResultAttributes,
  M.intermineGWASResultSort,
  M.response2gwasResults,
);
export const getGWASResultsForGeneticMarker = forParent(
  'GWASResult.markers.id',
  M.intermineGWASResultAttributes,
  M.intermineGWASResultSort,
  M.response2gwasResults,
);
export const getGWASResultsForTrait = forParent(
  'GWASResult.trait.id',
  M.intermineGWASResultAttributes,
  M.intermineGWASResultSort,
  M.response2gwasResults,
);
export const getGWASForTrait = forParent(
  'GWAS.results.trait.primaryIdentifier',
  M.intermineGWASAttributes,
  M.intermineGWASSort,
  M.response2gwas,
);
export const getQTLStudyForTrait = forParent(
  'QTLStudy.qtls.trait.primaryIdentifier',
  M.intermineQTLStudyAttributes,
  M.intermineQTLStudySort,
  M.response2qtlStudies,
);
export const getTraitsForGeneFunction = forParent(
  'Trait.geneFunctions.id',
  (M as any).intermineTraitBaseAttributes,
  M.intermineTraitSort,
  (M as any).response2traitsBase,
);

// ---- previously-deferred methods (special view factories / return shapes) --

// Pattern-B collection views rooted at the parent (ProteinDomain / OntologyTerm /
// SOTerm). No join factory in InterMine → all-INNER, so outerJoins default to [].
export const getChildFeaturesForProteinDomain = forParent(
  'ProteinDomain.id',
  M.intermineProteinDomainChildFeatureAttributes,
  M.intermineProteinDomainChildFeatureSort,
  M.response2proteinDomains,
);
export const getParentFeaturesForProteinDomain = forParent(
  'ProteinDomain.id',
  M.intermineProteinDomainParentFeatureAttributes,
  M.intermineProteinDomainParentFeatureSort,
  M.response2proteinDomains,
);
export const getCrossReferencesForOntologyTerm = forParent(
  'OntologyTerm.id',
  M.intermineOntologyTermCrossReferenceAttributes,
  M.intermineOntologyTermCrossReferenceSort,
  M.response2ontologyTerms,
);
export const getParentsForSequenceOntologyTerm = forParent(
  'SOTerm.id',
  M.intermineSequenceOntologyTermParentAttributes,
  M.intermineSequenceOntologyTermParentSort,
  M.response2ontologyTerms,
);

// Polymorphic (SequenceFeature) child-features collection view. SequenceFeature.
// childFeatures is unpopulated in this mine, so this returns empty; the object2result
// transform is a no-op on empty rows. (When populated, this would need the object-
// attribute variant + objectTransform, as for the other polymorphic relationships.)
export const getChildFeaturesForSequenceFeature = forParent(
  'SequenceFeature.id',
  (M as any).intermineSequenceFeatureChildFeatureAttributes,
  (M as any).intermineSequenceFeatureChildFeatureSort,
  (M as any).response2sequenceFeatures,
  sf('SequenceFeature.childFeatures'),
);

// SequenceFeature.overlappingFeatures is an ABSENT collection in this mine (see
// physical-names.ABSENT_COLLECTIONS) — there is no indirection table, so it always
// resolves to no members. Return empty directly rather than emitting a view that
// traverses a non-existent collection.
export async function getOverlappingFeaturesForSequenceFeature(
  this: SqliteServer,
  _id: number,
  page: PageOpts = {},
): Promise<ApiResponse<any[]>> {
  return {
    data: [],
    metadata: {pageInfo: graphqlPageInfo(0, page.page, page.pageSize)},
  };
}

// Special return shape: the unique, sorted synonym VALUES of a gene function's gene,
// as a plain string[]. Not an ApiResponse — mirrors intermine/api/get-gene-function-
// synonyms.ts.
export async function getSynonymsForGeneFunction(
  this: SqliteServer,
  id: number,
): Promise<string[]> {
  const response = this.pathQuery(
    'GeneFunction',
    ['GeneFunction.gene.synonyms.value'],
    undefined,
    [{path: 'GeneFunction.id', op: '=', value: id}],
  );
  const synonyms = new Set<string>();
  for (const row of (response as {results?: unknown[][]}).results ?? []) {
    if (row[0]) synonyms.add(String(row[0]));
  }
  return Array.from(synonyms).sort();
}
