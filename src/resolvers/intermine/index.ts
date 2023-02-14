// @ts-nocheck

import { mergeResolvers } from '@graphql-tools/merge';

import { DataSources } from '../../data-sources/index.js';

import { authorFactory } from './author.js';
import { chromosomeFactory } from './chromosome.js';
import { dataSetFactory } from './data-set.js';
import { expressionSampleFactory } from './expression-sample.js';
import { expressionSourceFactory } from './expression-source.js';
import { geneFactory } from './gene.js';
import { geneFamilyFactory } from './gene-family.js';
import { geneFamilyAssignmentFactory } from './gene-family-assignment.js';
import { geneFamilyTallyFactory } from './gene-family-tally.js';
import { geneticMapFactory } from './genetic-map.js';
import { geneticMarkerFactory } from './genetic-marker.js';
import { gwasFactory } from './gwas.js';
import { gwasResultFactory } from './gwas-result.js';
import { linkageGroupFactory } from './linkage-group.js';
import { linkageGroupPositionFactory } from './linkage-group-position.js';
import { locationFactory } from './location.js';
import { mRNAFactory } from './mrna.js';
import { ontologyFactory } from './ontology.js';
import { ontologyAnnotationFactory } from './ontology-annotation.js';
import { ontologyTermFactory } from './ontology-term.js';
import { organismFactory } from './organism.js';
import { pathwayFactory } from './pathway.js';
import { phylonodeFactory } from './phylonode.js';
import { phylotreeFactory } from './phylotree.js';
import { proteinDomainFactory } from './protein-domain.js';
import { proteinFactory } from './protein.js';
import { publicationFactory } from './publication.js';
import { qtlFactory } from './qtl.js';
import { qtlStudyFactory } from './qtl-study.js';
import { syntenicRegionFactory } from './syntenic-region.js';
import { syntenyBlockFactory } from './synteny-block.js';
import { strainFactory } from './strain.js';
import { traitFactory } from './trait.js';
import { mineWebPropertiesFactory } from './mine-web-properties.js';


const factories = [
    authorFactory,
    chromosomeFactory,
    dataSetFactory,
    expressionSampleFactory,
    expressionSourceFactory,
    geneFactory,
    geneFamilyFactory,
    geneFamilyAssignmentFactory,
    geneFamilyTallyFactory,
    geneticMapFactory,
    geneticMarkerFactory,
    gwasFactory,
    gwasResultFactory,
    linkageGroupFactory,
    linkageGroupPositionFactory,
    locationFactory,
    mRNAFactory,
    ontologyFactory,
    ontologyAnnotationFactory,
    ontologyTermFactory,
    organismFactory,
    pathwayFactory,
    phylonodeFactory,
    phylotreeFactory,
    proteinDomainFactory,
    proteinFactory,
    publicationFactory,
    qtlFactory,
    qtlStudyFactory,
    strainFactory,
    syntenicRegionFactory,
    syntenyBlockFactory,
    traitFactory,
    mineWebPropertiesFactory,
];


// a factory function that generates resolvers for a specific InterMine
// data source.
// TODO: our resolver type returned by the factories doesn't match the type
// expected by mergeResolvers
export const intermineResolverFactory = (sourceName: keyof DataSources) => {
    const sourceResolvers = factories.map((factory) => {
        return factory(sourceName);
    });
    return mergeResolvers(sourceResolvers);
};
