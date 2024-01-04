import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { SubfieldResolverMap } from '../resolver.js';
import { bioEntityFactory } from './bio-entity.js';


export const sequenceFeatureFactory =
    (sourceName: KeyOfType<DataSources, IntermineAPI>): SubfieldResolverMap => ({
        ...bioEntityFactory(sourceName),
        sequenceOntologyTerm: async (sequenceFeature, _, { dataSources }) => {
            return dataSources[sourceName].getSOTerm(sequenceFeature.soTermIdentifier)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        chromosome: async (sequenceFeature, _, { dataSources }) => {
            return dataSources[sourceName].getChromosome(sequenceFeature.chromosomeIdentifier)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        supercontig: async (sequenceFeature, _, { dataSources }) => {
            return dataSources[sourceName].getSupercontig(sequenceFeature.supercontigIdentifier)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        chromosomeLocation: async (sequenceFeature, _, { dataSources }) => {
            return dataSources[sourceName].getChromosomeLocation(sequenceFeature)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        supercontigLocation: async (sequenceFeature, _, { dataSources }) => {
            return dataSources[sourceName].getSupercontigLocation(sequenceFeature)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        overlappingFeatures: async (sequenceFeature, { page, pageSize }, { dataSources }) => {
            const args = {sequenceFeature: sequenceFeature, page, pageSize};
            return dataSources[sourceName].getOverlappingFeatures(args)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        // childFeatures: async (sequenceFeature, { page, pageSize }, { dataSources }) => {
        //     const args = {sequenceFeature: sequenceFeature, page, pageSize};
        //     return dataSources[sourceName].getChildFeatures(args)
        //     // @ts-ignore: implicit type any error
        //         .then(({data: results}) => results);
        // },
    });
