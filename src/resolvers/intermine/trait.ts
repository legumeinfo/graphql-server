import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


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
        traits: async (_, { name, start, size }, { dataSources }) => {
            const args = {name, start, size};
            return dataSources[sourceName].searchTraits(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    Trait: {
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
        qtls: async (trait, { start, size }, { dataSources }) => {
            const args = {trait, start, size};
            return dataSources[sourceName].getQTLs(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        gwas: async (trait, _, { dataSources }) => {
            return dataSources[sourceName].getGWASForTrait(trait)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        gwasResults: async (trait, { start, size }, { dataSources }) => {
            const args = {trait, start, size};
            return dataSources[sourceName].getGWASResults(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        ontologyAnnotations: async (trait, { start, size }, { dataSources }) => {
            const args = {annotatable: trait, start, size};
            return dataSources[sourceName].getOntologyAnnotations(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
