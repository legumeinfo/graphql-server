// @ts-nocheck

import { mergeResolvers } from '@graphql-tools/merge';

import { DataSources, IntermineAPI, MicroservicesAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';

import { annotatableFactory } from './annotatable.js';
import { authorFactory } from './author.js';
import { bioEntityFactory } from './bio-entity.js';
import { cdsFactory } from './cds.js';
import { chromosomeFactory } from './chromosome.js';
import { dataSetFactory, hasDataSetsFactory } from './data-set.js';
import { dataSourceFactory } from './data-source.js';
import { exonFactory } from './exon.js';
import { expressionSampleFactory } from './expression-sample.js';
import { expressionSourceFactory } from './expression-source.js';
import { expressionValueFactory } from './expression-value.js';
import { geneFactory } from './gene.js';
import { geneFamilyFactory } from './gene-family.js';
import { geneFamilyAssignmentFactory } from './gene-family-assignment.js';
import { geneFamilyTallyFactory } from './gene-family-tally.js';
import { geneFlankingRegionFactory } from './gene-flanking-region.js';
import { geneticMapFactory } from './genetic-map.js';
import { geneticMarkerFactory } from './genetic-marker.js';
import { genotypingPlatformFactory } from './genotyping-platform.js';
import { gwasFactory } from './gwas.js';
import { gwasResultFactory } from './gwas-result.js';
import { intergenicRegionFactory } from './intergenic-region.js';
import { intronFactory } from './intron.js';
import { linkageGroupFactory } from './linkage-group.js';
import { linkageGroupPositionFactory } from './linkage-group-position.js';
import { locationFactory } from './location.js';
import { mRNAFactory } from './mrna.js';
import { ontologyFactory } from './ontology.js';
import { ontologyAnnotationFactory, hasOntologyAnnotationsFactory } from './ontology-annotation.js';
import { ontologyTermFactory } from './ontology-term.js';
import { ontologyTermSynonymFactory } from './ontology-term-synonym.js';
import { organismFactory } from './organism.js';
import { panGeneSetFactory } from './pan-gene-set.js';
import { pathwayFactory } from './pathway.js';
import { phylonodeFactory } from './phylonode.js';
import { phylotreeFactory } from './phylotree.js';
import { proteinFactory } from './protein.js';
import { proteinDomainFactory } from './protein-domain.js';
import { proteinMatchFactory } from './protein-match.js';
import { publicationFactory, hasPublicationsFactory } from './publication.js';
import { qtlFactory } from './qtl.js';
import { qtlStudyFactory } from './qtl-study.js';
import { sequenceFeatureFactory } from './sequence-feature.js';
import { soTermFactory } from './so-term.js';
import { supercontigFactory } from './supercontig.js';
import { syntenicRegionFactory } from './syntenic-region.js';
import { syntenyBlockFactory } from './synteny-block.js';
import { strainFactory } from './strain.js';
import { traitFactory } from './trait.js';
import { transcriptFactory } from './transcript.js';
import { utrFactory } from './utr.js';

const factories = [
    annotatableFactory,
    authorFactory,
    bioEntityFactory,
    cdsFactory,
    chromosomeFactory,
    dataSetFactory,
    dataSourceFactory,
    exonFactory,
    expressionSampleFactory,
    expressionSourceFactory,
    expressionValueFactory,
    geneFactory,
    geneFamilyFactory,
    geneFamilyAssignmentFactory,
    geneFamilyTallyFactory,
    geneFlankingRegionFactory,
    geneticMapFactory,
    geneticMarkerFactory,
    genotypingPlatformFactory,
    gwasFactory,
    gwasResultFactory,
    hasDataSetsFactory,
    hasOntologyAnnotationsFactory,
    hasPublicationsFactory,
    intergenicRegionFactory,
    intronFactory,
    linkageGroupFactory,
    linkageGroupPositionFactory,
    locationFactory,
    mRNAFactory,
    ontologyFactory,
    ontologyAnnotationFactory,
    ontologyTermFactory,
    ontologyTermSynonymFactory,
    organismFactory,
    panGeneSetFactory,
    pathwayFactory,
    phylonodeFactory,
    phylotreeFactory,
    proteinFactory,
    proteinDomainFactory,
    proteinMatchFactory,
    publicationFactory,
    qtlFactory,
    qtlStudyFactory,
    sequenceFeatureFactory,
    soTermFactory,
    strainFactory,
    supercontigFactory,
    syntenicRegionFactory,
    syntenyBlockFactory,
    traitFactory,
    transcriptFactory,
    utrFactory,
];

// a factory function that generates resolvers for a specific InterMine data source.
// TODO: our resolver type returned by the factories doesn't match the type expected by mergeResolvers.
export const intermineResolverFactory =
(
    sourceName: KeyOfType<DataSources, IntermineAPI>,
    microservicesSource: KeyOfType<DataSources, MicroservicesAPI>,
) => {
    const sourceResolvers = factories.map((factory) => {
        return factory(sourceName, microservicesSource);
    });
    return mergeResolvers(sourceResolvers);
};
