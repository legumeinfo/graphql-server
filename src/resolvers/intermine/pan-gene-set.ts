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
        dataSets: async (panGeneSet, { page, pageSize }, { dataSources }) => {
            const args = {page, pageSize};
            return dataSources[sourceName].getDataSetsForPanGeneSet(panGeneSet, args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        genes: async (panGeneSet, { genus, species, strain, assembly, annotation, page, pageSize }, { dataSources }) => {
            const args = {panGeneSet, genus, species, strain, assembly, annotation, page, pageSize};
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
        linkouts: async (panGeneSet, _, { dataSources }) => {
            const {identifier} = panGeneSet;
            return dataSources[microservicesSource].getLinkoutsForPanGeneSet(identifier);
        },
    },
});
