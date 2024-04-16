import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { SubfieldResolverMap } from '../resolver.js';
import { bioEntityFactory } from './bio-entity.js';

export const sequenceFeatureFactory =
    (sourceName: KeyOfType<DataSources, IntermineAPI>): SubfieldResolverMap => ({
        ...bioEntityFactory(sourceName),
        sequenceOntologyTerm: async (sequenceFeature, _, { dataSources }) => {
            return dataSources[sourceName].getSequenceOntologyTerm(sequenceFeature.soTermIdentifier)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        chromosome: async (sequenceFeature, _, { dataSources }) => {
            const { chromosomeIdentifier } = sequenceFeature;
            if (chromosomeIdentifier) {
                return dataSources[sourceName].getChromosome(sequenceFeature.chromosomeIdentifier)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            }
        },
        supercontig: async (sequenceFeature, _, { dataSources }) => {
            const { supercontigIdentifier } = sequenceFeature;
            if (supercontigIdentifier) {
                return dataSources[sourceName].getSupercontig(sequenceFeature.supercontigIdentifier)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            }
        },
        chromosomeLocation: async (sequenceFeature, _, { dataSources }) => {
            const { chromosomeLocationId } = sequenceFeature;
            if (chromosomeLocationId) {
                return dataSources[sourceName].getLocation(chromosomeLocationId)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            }
        },
        supercontigLocation: async (sequenceFeature, _, { dataSources }) => {
            const { supercontigLocationId } = sequenceFeature;
            if (supercontigLocationId) {
                return dataSources[sourceName].getLocation(supercontigLocationId)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            }
        },
        overlappingFeatures: async (sequenceFeature, { page, pageSize }, { dataSources }) => {
            const { id } = sequenceFeature;
            return dataSources[sourceName].getOverlappingFeaturesForSequenceFeature(id, {page, pageSize})
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        childFeatures: async (sequenceFeature, { page, pageSize }, { dataSources }) => {
            const { id } = sequenceFeature;
            return dataSources[sourceName].getChildFeaturesForSequenceFeature(id, {page, pageSize})
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        sequence: async (sequenceFeature, _, { dataSources }) => {
            const { sequenceId } = sequenceFeature;
            if (sequenceId == null) {
                return null;
            }
            return dataSources[sourceName].getSequence(sequenceId)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    });
