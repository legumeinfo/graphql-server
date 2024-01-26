import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';

export const qtlFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        qtl: async (_, { identifier }, { dataSources }) => {
            const {data: qtl} = await dataSources[sourceName].getQTL(identifier);
            if (qtl == null) {
                const msg = `QTL with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: qtl};
        },
        qtls: async (_, { traitName, page, pageSize }, { dataSources }) => {
            const args = {traitName, page, pageSize};
            return dataSources[sourceName].searchQTLs(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    QTL: {
        ...annotatableFactory(sourceName),
        trait: async (qtl, _, { dataSources }) => {
            return dataSources[sourceName].getTrait(qtl.traitIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        qtlStudy: async (qtl, _, { dataSources }) => {
            return dataSources[sourceName].getQTLStudy(qtl.qtlStudyIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        linkageGroup: async (qtl, _, { dataSources }) => {
            return dataSources[sourceName].getLinkageGroup(qtl.linkageGroupIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        genes: async (qtl, { page, pageSize }, { dataSources }) => {
            const args = {qtl, page, pageSize};
            return dataSources[sourceName].getQTLGenes(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        markers: async (qtl, { page, pageSize }, { dataSources }) => {
            const args = {qtl, page, pageSize};
            return dataSources[sourceName].getGeneticMarkers(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
