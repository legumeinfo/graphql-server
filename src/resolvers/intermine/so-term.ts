import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { hasDataSetsFactory } from './data-set.js';

export const soTermFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        soTerm: async (_, { identifier }, { dataSources }) => {
            console.log(identifier);
            const {data: term} = await dataSources[sourceName].getSOTerm(identifier);
            if (term == null) {
                const msg = `SOTerm with identifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: term};
        },
    },
    SOTerm: {
        ...hasDataSetsFactory(sourceName),
        // ontology: async (soTerm, _, { dataSources }) => {
        //     return dataSources[sourceName].getSOTermOntology(soTerm)
        //     // @ts-ignore: implicit type any error
        //         .then(({data: results}) => results);
        // },
        // relations: async (soTerm, { page, pageSize }, { dataSources }) => {
        //     const args = {soTerm: soTerm, page, pageSize};
        //     return dataSources[sourceName].getSOTermRelations(args)
        //     // @ts-ignore: implicit type any error
        //         .then(({data: results}) => results);
        // },
        // synonyms: async (soTerm, { page, pageSize }, { dataSources }) => {
        //     const args = {soTerm: soTerm, page, pageSize};
        //     return dataSources[sourceName].getSOTermSynonyms(args)
        //     // @ts-ignore: implicit type any error
        //         .then(({data: results}) => results);
        // },
        parents: async (soTerm, { page, pageSize }, { dataSources }) => {
            const args = {soTerm: soTerm, page, pageSize};
            return dataSources[sourceName].getSOTermParents(args)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        // crossReferences: async (soTerm, { page, pageSize }, { dataSources }) => {
        //     const args = {soTerm: soTerm, page, pageSize};
        //     return dataSources[sourceName].getSOTermCrossReferences(args)
        //     // @ts-ignore: implicit type any error
        //         .then(({data: results}) => results);
        // },
    },
});
