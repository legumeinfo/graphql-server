import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const qtlFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        qtl: async (_, { id }, { dataSources }) => {
            const {data: qtl} = await dataSources[sourceName].getQTL(id);
            if (qtl == null) {
                const msg = `QTL with ID '${id}' not found`;
                inputError(msg);
            }
            return {results: qtl};
        },
        qtls: async (_, { traitName, start, size }, { dataSources }) => {
            const args = {traitName, start, size};
            return dataSources[sourceName].searchQTLs(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    QTL: {
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
            return dataSources[sourceName].getLinkageGroup(qtl.linkageGroupId)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        dataSet: async (qtl, _, { dataSources }) => {
            return dataSources[sourceName].getDataSet(qtl.dataSetName)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        markers: async (qtl, { start, size }, { dataSources }) => {
            const args = {qtl, start, size};
            return dataSources[sourceName].getGeneticMarkers(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
