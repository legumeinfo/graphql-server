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


export const hasTranscriptFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    transcript: async (parent, _, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const typeName = info.parentType.name;
        switch (typeName) {
            case 'CDS':
            case 'Protein':
                const {transcriptIdentifier} = parent;
                request = dataSources[sourceName].getTranscript(transcriptIdentifier);
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});


export const hasTranscriptsFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    transcripts: async (parent, { page, pageSize }, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const args = {page, pageSize};
        const typeName = info.parentType.name;
        switch (typeName) {
            case 'Exon':
            case 'Gene':
            case 'Intron':
            case 'PanGeneSet':
            // @ts-ignore: fallthrough case error
            case 'UTR':
                const {id} = parent;
            case 'Exon':
                request = dataSources[sourceName].getTranscriptsForExon(id, args);
                break;
            case 'Gene':
                request = dataSources[sourceName].getTranscriptsForGene(id, args);
                break;
            case 'Intron':
                request = dataSources[sourceName].getTranscriptsForIntron(id, args);
                break;
            case 'PanGeneSet':
                request = dataSources[sourceName].getTranscriptsForPanGeneSet(id, args);
                break;
            case 'UTR':
                request = dataSources[sourceName].getTranscriptsForUTR(id, args);
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});
