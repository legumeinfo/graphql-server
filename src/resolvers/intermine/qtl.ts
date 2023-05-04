import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const qtlFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        qtl:  async (_, { id }, { dataSources }) => {
            return dataSources[sourceName].getQTL(id);
        },
        qtls: async (_, { traitName, start, size }, { dataSources }) => {
            const args = {traitName, start, size};
            return dataSources[sourceName].searchQTLs(args);
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
