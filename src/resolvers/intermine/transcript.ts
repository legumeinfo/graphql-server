import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { SubfieldResolverMap } from '../resolver.js';
import { sequenceFeatureFactory } from './sequence-feature.js';

export const transcriptFactory =
    (sourceName: KeyOfType<DataSources, IntermineAPI>): SubfieldResolverMap => ({
        ...sequenceFeatureFactory(sourceName),
        gene: async (transcript, _, { dataSources }) => {
            return dataSources[sourceName].getGene(transcript.geneIdentifier)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        protein: async (transcript, _, { dataSources }) => {
            return dataSources[sourceName].getProtein(transcript.proteinIdentifier)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        introns: async (transcript, { page, pageSize }, { dataSources }) => {
            const { id } = transcript;
            return dataSources[sourceName].getIntronsForTranscript(id, {page, pageSize})
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        exons: async (transcript, { page, pageSize }, { dataSources }) => {
            const { id } = transcript;
            return dataSources[sourceName].getExonsForTranscript(id, {page, pageSize})
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        CDSs: async (transcript, { page, pageSize }, { dataSources }) => {
            const { id } = transcript;
            return dataSources[sourceName].getCDSsForTranscript(id, {page, pageSize})
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        UTRs: async (transcript, { page, pageSize }, { dataSources }) => {
            const { id } = transcript;
            return dataSources[sourceName].getUTRsForTranscript(id, {page, pageSize})
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        panGeneSets: async (transcript, { page, pageSize }, { dataSources }) => {
            const { id } = transcript;
            return dataSources[sourceName].getPanGeneSetsForTranscript(id, {page, pageSize})
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    });
