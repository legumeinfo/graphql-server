import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const qtlStudyFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        qtlStudy: async (_, { identifier }, { dataSources }) => {
            const study = await dataSources[sourceName].getQTLStudy(identifier);
            if (study == null) {
                const msg = `QTLStudy with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return study;
        },
        qtlStudies: async (_, { description, start, size }, { dataSources }) => {
            const args = {description, start, size};
            return dataSources[sourceName].searchQTLStudies(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    QTLStudy: {
        organism: async (qtlStudy, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(qtlStudy.organismTaxonId);
        },
        dataSet: async (qtlStudy, _, { dataSources }) => {
            return dataSources[sourceName].getDataSet(qtlStudy.dataSetName);
        },
        qtls: async (qtlStudy, { start, size }, { dataSources }) => {
            const args = {qtlStudy, start, size};
            return dataSources[sourceName].getQTLs(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        publications: async (qtlStudy, { start, size }, { dataSources }) => {
            const args = {annotatable: qtlStudy, start, size};
            return dataSources[sourceName].getPublications(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    }
});
