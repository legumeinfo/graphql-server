// get-one.ts — the getX(identifier) methods: a single '=' lookup returning the
// first match or null. Each is one getOne() line; multi-field / short-circuit
// variants (getAuthor, getExpressionValue, getGene, getPanGeneSet) are written out.
// Reuses the InterMine model modules verbatim (imported as M), and the InterMine
// join factories to pass the OUTER-join declarations (outerPaths) so optional
// references match InterMine's INNER-by-default behavior. Only the query path
// differs. Mirrors intermine/api/get-*.ts one-for-one.
import {SqliteServer, ApiResponse} from '../sqlite.server.js';
import type {Constraint} from '../path-resolver.js';
import {getOne, firstOrNull, outerPaths, objectTransform} from './helpers.js';
import * as M from '../../intermine/models/index.js';
import {sequenceFeatureJoinFactory} from '../../intermine/api/sequence-feature.js';
import {bioEntityJoinFactory} from '../../intermine/api/bio-entity.js';
import {geneJoinFactory} from '../../intermine/api/gene.js';
import {geneFamilyJoinFactory} from '../../intermine/api/gene-family.js';
import {proteinJoinFactory} from '../../intermine/api/protein.js';
import {traitJoinFactory} from '../../intermine/api/trait.js';

// OUTER paths for a SequenceFeature-rooted view (chromosome, supercontig, strain,
// sequence, sequenceOntologyTerm, …). organism is INNER (not returned here).
const sf = (root: string) => outerPaths(sequenceFeatureJoinFactory(root));

// ---- simple single-field lookups -----------------------------------------
export const getOrganism = getOne(
  'Organism',
  'taxonId',
  M.intermineOrganismAttributes,
  M.intermineOrganismSort,
  M.response2organisms,
);
export const getStrain = getOne(
  'Strain',
  'identifier',
  M.intermineStrainAttributes,
  M.intermineStrainSort,
  M.response2strains,
);
export const getDataSource = getOne(
  'DataSource',
  'name',
  M.intermineDataSourceAttributes,
  M.intermineDataSourceSort,
  M.response2dataSources,
);
export const getPublication = getOne(
  'Publication',
  'doi',
  M.interminePublicationAttributes,
  M.interminePublicationSort,
  M.response2publications,
);
export const getChromosome = getOne(
  'Chromosome',
  'primaryIdentifier',
  M.intermineChromosomeAttributes,
  M.intermineChromosomeSort,
  M.response2chromosomes,
  sf('Chromosome'),
);

export const getCDS = getOne(
  'CDS',
  'primaryIdentifier',
  M.intermineCDSAttributes,
  M.intermineCDSSort,
  M.response2cdss,
  sf('CDS'),
);
export const getDataSet = getOne(
  'DataSet',
  'name',
  M.intermineDataSetAttributes,
  M.intermineDataSetSort,
  M.response2dataSets,
);
export const getExon = getOne(
  'Exon',
  'primaryIdentifier',
  M.intermineExonAttributes,
  M.intermineExonSort,
  M.response2exons,
  sf('Exon'),
);
export const getExpressionSample = getOne(
  'ExpressionSample',
  'primaryIdentifier',
  M.intermineExpressionSampleAttributes,
  M.intermineExpressionSampleSort,
  M.response2expressionSamples,
);
export const getExpressionSource = getOne(
  'ExpressionSource',
  'primaryIdentifier',
  M.intermineExpressionSourceAttributes,
  M.intermineExpressionSourceSort,
  M.response2expressionSources,
);
export const getGeneFamily = getOne(
  'GeneFamily',
  'primaryIdentifier',
  M.intermineGeneFamilyAttributes,
  M.intermineGeneFamilySort,
  M.response2geneFamilies,
  outerPaths(geneFamilyJoinFactory()),
);
export const getGeneFamilyAssignment = getOne(
  'GeneFamilyAssignment',
  'id',
  M.intermineGeneFamilyAssignmentAttributes,
  M.intermineGeneFamilyAssignmentSort,
  M.response2geneFamilyAssignments,
);
export const getGeneFamilyTally = getOne(
  'GeneFamilyTally',
  'id',
  M.intermineGeneFamilyTallyAttributes,
  M.intermineGeneFamilyTallySort,
  M.response2geneFamilyTallies,
);
export const getGeneFlankingRegion = getOne(
  'GeneFlankingRegion',
  'primaryIdentifier',
  M.intermineGeneFlankingRegionAttributes,
  M.intermineGeneFlankingRegionSort,
  M.response2geneFlankingRegions,
  sf('GeneFlankingRegion'),
);
export const getGeneticMap = getOne(
  'GeneticMap',
  'primaryIdentifier',
  M.intermineGeneticMapAttributes,
  M.intermineGeneticMapSort,
  M.response2geneticMaps,
);
export const getGeneticMarker = getOne(
  'GeneticMarker',
  'primaryIdentifier',
  M.intermineGeneticMarkerAttributes,
  M.intermineGeneticMarkerSort,
  M.response2geneticMarkers,
  sf('GeneticMarker'),
);
export const getGenotypingPlatform = getOne(
  'GenotypingPlatform',
  'primaryIdentifier',
  M.intermineGenotypingPlatformAttributes,
  M.intermineGenotypingPlatformSort,
  M.response2genotypingPlatforms,
);
export const getGWAS = getOne(
  'GWAS',
  'primaryIdentifier',
  M.intermineGWASAttributes,
  M.intermineGWASSort,
  M.response2gwas,
);
export const getGWASResult = getOne(
  'GWASResult',
  'primaryIdentifier',
  M.intermineGWASResultAttributes,
  M.intermineGWASResultSort,
  M.response2gwasResults,
);
export const getIntergenicRegion = getOne(
  'IntergenicRegion',
  'primaryIdentifier',
  M.intermineIntergenicRegionAttributes,
  M.intermineIntergenicRegionSort,
  M.response2intergenicRegions,
  sf('IntergenicRegion'),
);
export const getIntron = getOne(
  'Intron',
  'primaryIdentifier',
  M.intermineIntronAttributes,
  M.intermineIntronSort,
  M.response2introns,
  sf('Intron'),
);
export const getLinkageGroup = getOne(
  'LinkageGroup',
  'primaryIdentifier',
  M.intermineLinkageGroupAttributes,
  M.intermineLinkageGroupSort,
  M.response2linkageGroups,
);
export const getLinkageGroupPosition = getOne(
  'LinkageGroupPosition',
  'id',
  M.intermineLinkageGroupPositionAttributes,
  M.intermineLinkageGroupPositionSort,
  M.response2linkageGroupPositions,
);
// Polymorphic root: query with the OBJECT attributes (which include .class and
// .objectId and align with the graphql output), then map positional -> graphql.
export const getLocation = getOne(
  'Location',
  'id',
  (M as any).intermineLocationObjectAttributes,
  M.intermineLocationSort,
  objectTransform(
    (M as any).intermineLocationObjectAttributes,
    (M as any).graphqlLocationAttributes,
  ),
);
export const getMRNA = getOne(
  'MRNA',
  'primaryIdentifier',
  M.intermineMRNAAttributes,
  M.intermineMRNASort,
  M.response2mRNAs,
  sf('MRNA'),
);
export const getNewick = getOne(
  'Newick',
  'identifier',
  M.intermineNewickAttributes,
  M.intermineNewickSort,
  M.response2newicks,
);
export const getOntology = getOne(
  'Ontology',
  'name',
  M.intermineOntologyAttributes,
  M.intermineOntologySort,
  M.response2ontologies,
);
export const getOntologyAnnotation = getOne(
  'OntologyAnnotation',
  'id',
  M.intermineOntologyAnnotationAttributes,
  M.intermineOntologyAnnotationSort,
  M.response2ontologyAnnotations,
);
export const getOntologyRelation = getOne(
  'OntologyRelation',
  'name',
  M.intermineOntologyRelationAttributes,
  M.intermineOntologyRelationSort,
  M.response2ontologyRelations,
);
export const getOntologyTerm = getOne(
  'OntologyTerm',
  'identifier',
  M.intermineOntologyTermAttributes,
  M.intermineOntologyTermSort,
  M.response2ontologyTerms,
);
export const getOntologyTermSynonym = getOne(
  'OntologyTermSynonym',
  'name',
  M.intermineOntologyTermSynonymAttributes,
  M.intermineOntologyTermSynonymSort,
  M.response2ontologyTermSynonyms,
);
export const getPathway = getOne(
  'Pathway',
  'primaryIdentifier',
  M.interminePathwayAttributes,
  M.interminePathwaySort,
  M.response2pathways,
);
export const getPhylonode = getOne(
  'Phylonode',
  'identifier',
  M.interminePhylonodeAttributes,
  M.interminePhylonodeSort,
  M.response2phylonodes,
);
export const getPhylotree = getOne(
  'Phylotree',
  'primaryIdentifier',
  M.interminePhylotreeAttributes,
  M.interminePhylotreeSort,
  M.response2phylotrees,
);
export const getProtein = getOne(
  'Protein',
  'primaryIdentifier',
  M.intermineProteinAttributes,
  M.intermineProteinSort,
  M.response2proteins,
  outerPaths(proteinJoinFactory()),
);
export const getProteinDomain = getOne(
  'ProteinDomain',
  'primaryIdentifier',
  M.intermineProteinDomainAttributes,
  M.intermineProteinDomainSort,
  M.response2proteinDomains,
);
export const getProteinMatch = getOne(
  'ProteinMatch',
  'primaryIdentifier',
  M.intermineProteinMatchAttributes,
  M.intermineProteinMatchSort,
  M.response2proteinMatches,
  outerPaths(bioEntityJoinFactory('ProteinMatch')),
);
export const getQTL = getOne(
  'QTL',
  'primaryIdentifier',
  M.intermineQTLAttributes,
  M.intermineQTLSort,
  M.response2qtls,
);
export const getQTLStudy = getOne(
  'QTLStudy',
  'primaryIdentifier',
  M.intermineQTLStudyAttributes,
  M.intermineQTLStudySort,
  M.response2qtlStudies,
);
export const getSequence = getOne(
  'Sequence',
  'id',
  M.intermineSequenceAttributes,
  M.intermineSequenceSort,
  M.response2sequences,
);
export const getSequenceFeature = getOne(
  'SequenceFeature',
  'id',
  (M as any).intermineSequenceFeatureObjectAttributes,
  M.intermineSequenceFeatureSort,
  objectTransform(
    (M as any).intermineSequenceFeatureObjectAttributes,
    (M as any).graphqlSequenceFeatureAttributes,
  ),
  sf('SequenceFeature'),
);
// SOTerm is a distinct root class holding the sequence-ontology terms.
export const getSequenceOntologyTerm = getOne(
  'SOTerm',
  'identifier',
  M.intermineSequenceOntologyTermAttributes,
  M.intermineSequenceOntologyTermSort,
  M.response2ontologyTerms,
);
export const getSupercontig = getOne(
  'Supercontig',
  'primaryIdentifier',
  M.intermineSupercontigAttributes,
  M.intermineSupercontigSort,
  M.response2supercontigs,
  sf('Supercontig'),
);
export const getSyntenicRegion = getOne(
  'SyntenicRegion',
  'primaryIdentifier',
  M.intermineSyntenicRegionAttributes,
  M.intermineSyntenicRegionSort,
  M.response2syntenicRegions,
  sf('SyntenicRegion'),
);
export const getSyntenyBlock = getOne(
  'SyntenyBlock',
  'id',
  M.intermineSyntenyBlockAttributes,
  M.intermineSyntenyBlockSort,
  M.response2syntenyBlocks,
);
export const getTrait = getOne(
  'Trait',
  'primaryIdentifier',
  M.intermineTraitAttributes,
  M.intermineTraitSort,
  M.response2traits,
  outerPaths(traitJoinFactory()),
);
export const getTranscript = getOne(
  'Transcript',
  'primaryIdentifier',
  (M as any).intermineTranscriptObjectAttributes,
  M.intermineTranscriptSort,
  objectTransform(
    (M as any).intermineTranscriptObjectAttributes,
    (M as any).graphqlTranscriptAttributes,
  ),
  sf('Transcript'),
);
export const getUTR = getOne(
  'UTR',
  'primaryIdentifier',
  M.intermineUTRAttributes,
  M.intermineUTRSort,
  M.response2utrs,
  sf('UTR'),
);

// ---- multi-field / short-circuit variants --------------------------------

// Two-field lookup.
export async function getAuthor(
  this: SqliteServer,
  firstName: string,
  lastName: string,
): Promise<ApiResponse<M.GraphQLAuthor>> {
  const response = this.pathQuery(
    'Author',
    M.intermineAuthorAttributes,
    M.intermineAuthorSort,
    [
      {path: 'Author.firstName', op: '=', value: firstName},
      {path: 'Author.lastName', op: '=', value: lastName},
    ],
  );
  return {
    data: firstOrNull(M.response2authors(response as any)) as M.GraphQLAuthor,
  };
}

// Two-constraint lookup on the sample + feature identifiers. ExpressionValue is a
// simple object (no id), but this is a get-one so no count is needed.
export async function getExpressionValue(
  this: SqliteServer,
  sampleIdentifier: string,
  geneIdentifier: string,
): Promise<ApiResponse<M.GraphQLExpressionValue>> {
  const response = this.pathQuery(
    'ExpressionValue',
    M.intermineExpressionValueAttributes,
    M.intermineExpressionValueSort,
    [
      {
        path: 'ExpressionValue.sample.primaryIdentifier',
        op: '=',
        value: sampleIdentifier,
      },
      {
        path: 'ExpressionValue.feature.primaryIdentifier',
        op: '=',
        value: geneIdentifier,
      },
    ],
  );
  return {
    data: firstOrNull(
      M.response2expressionValues(response as any),
    ) as M.GraphQLExpressionValue,
  };
}

// getGene / getPanGeneSet carry the InterMine `fields` short-circuit: if the only
// requested field is the identifier, echo it back without a query.
export async function getGene(
  this: SqliteServer,
  identifier: string,
  fields: string[] = [],
): Promise<ApiResponse<M.GraphQLGene>> {
  if (fields.length === 1 && fields[0] === 'identifier') {
    return {data: {identifier} as unknown as M.GraphQLGene};
  }
  const response = this.pathQuery(
    'Gene',
    M.intermineGeneAttributes,
    M.intermineGeneSort,
    [{path: 'Gene.primaryIdentifier', op: '=', value: identifier}],
    undefined,
    undefined,
    outerPaths(geneJoinFactory()),
  );
  return {
    data: firstOrNull(M.response2genes(response as any)) as M.GraphQLGene,
  };
}

export async function getPanGeneSet(
  this: SqliteServer,
  identifier: string,
  fields: string[] = [],
): Promise<ApiResponse<M.GraphQLPanGeneSet>> {
  if (fields.length === 1 && fields[0] === 'identifier') {
    return {data: {identifier} as unknown as M.GraphQLPanGeneSet};
  }
  const response = this.pathQuery(
    'PanGeneSet',
    M.interminePanGeneSetAttributes,
    M.interminePanGeneSetSort,
    [
      {path: 'PanGeneSet.primaryIdentifier', op: '=', value: identifier},
    ] as Constraint[],
  );
  return {
    data: firstOrNull(
      M.response2panGeneSets(response as any),
    ) as M.GraphQLPanGeneSet,
  };
}
