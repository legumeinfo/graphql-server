import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { isOntologyTermFactory } from './ontology-term-interface.js';

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
        ...isOntologyTermFactory(sourceName),
        // synonyms: async (soTerm, { page, pageSize }, { dataSources }) => {
        //     const args = {soTerm: soTerm, page, pageSize};
        //     return dataSources[sourceName].getSOTermSynonyms(args)
        //     // @ts-ignore: implicit type any error
        //         .then(({data: results}) => results);
        // },
        parents: async (soTerm, { page, pageSize }, { dataSources }) => {
            const { id } = soTerm;
            return dataSources[sourceName].getParentsForSOTerm(id, {page, pageSize})
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
