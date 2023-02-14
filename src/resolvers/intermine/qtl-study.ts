import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const qtlStudyFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        qtlStudy:  async (_, { id }, { dataSources }) => {
            return dataSources[sourceName].getQTLStudy(id);
        },
        qtlStudies: async (_, { description, start, size }, { dataSources }) => {
            const args = {description, start, size};
            return dataSources[sourceName].searchQTLStudies(args);
        },
    },
    QTLStudy: {
        organism: async (qtlStudy, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(qtlStudy.organismId);
        },
        dataSet: async (qtlStudy, _, { dataSources }) => {
            return dataSources[sourceName].getDataSet(qtlStudy.dataSetId);
        },
        qtls: async (qtlStudy, _, { dataSources }) => {
            const args = {qtlStudy};
            return dataSources[sourceName].getQTLs(args);
        },
        publications: async (qtlStudy, { start, size }, { dataSources }) => {
            const args = {annotatable: qtlStudy, start, size};
            return dataSources[sourceName].getPublications(args);
        },
    }
});
