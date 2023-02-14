import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const qtlFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        qtl:  async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getQTL(id);
        },
        qtls: async (_source, { traitName, start, size }, { dataSources }) => {
            const args = {traitName, start, size};
            return dataSources[sourceName].searchQTLs(args);
        },
    },
    QTL: {
        trait: async (qtl, { }, { dataSources }) => {
            return dataSources[sourceName].getTrait(qtl.traitId);
        },
        qtlStudy: async (qtl, { }, { dataSources }) => {
            return dataSources[sourceName].getQTLStudy(qtl.qtlStudyId);
        },
        linkageGroup: async (qtl, { }, { dataSources }) => {
            return dataSources[sourceName].getLinkageGroup(qtl.linkageGroupId);
        },
        dataSet: async (qtl, { }, { dataSources }) => {
            return dataSources[sourceName].getDataSet(qtl.dataSetId);
        },
        markers: async (qtl, { start, size }, { dataSources }) => {
            const args = {qtl, start, size};
            return dataSources[sourceName].getGeneticMarkers(args);
        },
    },
});
