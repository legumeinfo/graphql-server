import { DataSources, IntermineAPI, MicroservicesAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableInterfaceFactory } from './annotatable-interface.js';

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
        ...annotatableInterfaceFactory(sourceName),
        dataSets: async (panGeneSet, { page, pageSize }, { dataSources }) => {
            const args = {bioEntity: panGeneSet, page, pageSize};
            return dataSources[sourceName].getDataSets(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        genes: async (panGeneSet, { page, pageSize }, { dataSources }) => {
            const args = {panGeneSet, page, pageSize};
            return dataSources[sourceName].getGenes(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        proteins: async (panGeneSet, { page, pageSize }, { dataSources }) => {
            const args = {panGeneSet, page, pageSize};
            return dataSources[sourceName].getProteins(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        mRNAs: async (panGeneSet, { page, pageSize }, { dataSources }) => {
            const args = {panGeneSet, page, pageSize};
            return dataSources[sourceName].getMRNAs(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        linkouts: async (panGeneSet, _, { dataSources }) => {
            const {identifier} = panGeneSet;
            return dataSources[microservicesSource].getLinkoutsForPanGeneSet(identifier);
        },
    },
});
