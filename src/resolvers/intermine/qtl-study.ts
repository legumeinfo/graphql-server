import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const qtlStudyFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        qtlStudy:  async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getQTLStudy(id);
        },
        qtlStudies: async (_source, { description, start, size }, { dataSources }) => {
            const args = {description, start, size};
            return dataSources[sourceName].searchQTLStudies(args);
        },
    },
    QTLStudy: {
        organism: async (qtlStudy, { }, { dataSources }) => {
            return dataSources[sourceName].getOrganism(qtlStudy.organismId);
        },
        dataSet: async (qtlStudy, { }, { dataSources }) => {
            return dataSources[sourceName].getDataSet(qtlStudy.dataSetId);
        },
        qtls: async (qtlStudy, { }, { dataSources }) => {
            const args = {qtlStudy};
            return dataSources[sourceName].getQTLs(args);
        },
        publications: async (qtlStudy, { start, size }, { dataSources }) => {
            const args = {annotatable: qtlStudy, start, size};
            return dataSources[sourceName].getPublications(args);
        },
    }
});
