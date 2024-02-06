import { DataSources, IntermineAPI, MicroservicesAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';

export const panGeneSetFactory = 
    (
        sourceName: KeyOfType<DataSources, IntermineAPI>,
        microservicesSource: KeyOfType<DataSources, MicroservicesAPI>,
    ): ResolverMap => ({
    Query: {
        panGeneSet: async (_, { identifier }, { dataSources }) => {
            const {data: panGeneSet} = await dataSources[sourceName].getPanGeneSet(identifier);
            if (panGeneSet == null) {
                const msg = `PanGeneSet with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: panGeneSet};
        },
    },
    PanGeneSet: {
        ...annotatableFactory(sourceName),
        transcripts: async (panGeneSet, { page, pageSize }, { dataSources }) => {
            const { id } = panGeneSet;
            return dataSources[sourceName].getTranscriptsForPanGeneSet(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        genes: async (panGeneSet, { page, pageSize }, { dataSources }) => {
            const { id } = panGeneSet;
            return dataSources[sourceName].getGenesForPanGeneSet(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        proteins: async (panGeneSet, { page, pageSize }, { dataSources }) => {
            const { id } = panGeneSet;
            return dataSources[sourceName].getProteinsForPanGeneSet(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        linkouts: async (panGeneSet, _, { dataSources }) => {
            return dataSources[microservicesSource].getLinkouts({panGeneSet});
        },
    },
});
