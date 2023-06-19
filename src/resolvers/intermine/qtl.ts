import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const qtlFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        qtl: async (_, { id }, { dataSources }) => {
            const qtl = await dataSources[sourceName].getQTL(id);
            if (qtl == null) {
                const msg = `QTL with ID '${id}' not found`;
                inputError(msg);
            }
            return qtl;
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
            return dataSources[sourceName].getTrait(qtl.traitIdentifier);
        },
        qtlStudy: async (qtl, _, { dataSources }) => {
            return dataSources[sourceName].getQTLStudy(qtl.qtlStudyIdentifier);
        },
        linkageGroup: async (qtl, _, { dataSources }) => {
            return dataSources[sourceName].getLinkageGroup(qtl.linkageGroupId);
        },
        dataSet: async (qtl, _, { dataSources }) => {
            return dataSources[sourceName].getDataSet(qtl.dataSetName);
        },
        markers: async (qtl, { start, size }, { dataSources }) => {
            const args = {qtl, start, size};
            return dataSources[sourceName].getGeneticMarkers(args);
        },
    },
});
