import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';


export const traitFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        trait: async (_, { identifier }, { dataSources }) => {
            const {data: trait} = await dataSources[sourceName].getTrait(identifier);
            if (trait == null) {
                const msg = `Trait with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: trait};
        },
        traits: async (_, { name, studyType, publicationId, author, page, pageSize }, { dataSources }) => {
            const args = {name, studyType, publicationId, author, page, pageSize};
            return dataSources[sourceName].searchTraits(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    Trait: {
        ...annotatableFactory(sourceName),
        dataSet: async (trait, _, { dataSources }) => {
            return dataSources[sourceName].getDataSet(trait.dataSetName)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        qtlStudy: async (trait, _, { dataSources }) => {
            return dataSources[sourceName].getQTLStudyForTrait(trait)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        qtls: async (trait, { page, pageSize }, { dataSources }) => {
            const args = {trait, page, pageSize};
            return dataSources[sourceName].getQTLs(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        gwas: async (trait, _, { dataSources }) => {
            return dataSources[sourceName].getGWASForTrait(trait)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        gwasResults: async (trait, { page, pageSize }, { dataSources }) => {
            const args = {trait, page, pageSize};
            return dataSources[sourceName].getGWASResults(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
