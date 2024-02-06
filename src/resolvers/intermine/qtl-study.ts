import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';

export const qtlStudyFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        qtlStudy: async (_, { identifier }, { dataSources }) => {
            const {data: study} = await dataSources[sourceName].getQTLStudy(identifier);
            if (study == null) {
                const msg = `QTLStudy with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: study};
        },
        qtlStudies: async (_, { description, page, pageSize }, { dataSources }) => {
            const args = {description, page, pageSize};
            return dataSources[sourceName].searchQTLStudies(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    QTLStudy: {
        ...annotatableFactory(sourceName),
        organism: async (qtlStudy, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(qtlStudy.organismTaxonId)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        qtls: async (qtlStudy, { page, pageSize }, { dataSources }) => {
            const { id } = qtlStudy;
            return dataSources[sourceName].getQTLsForQTLStudy(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
