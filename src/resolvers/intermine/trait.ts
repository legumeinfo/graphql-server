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
        organism: async (trait, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(trait.organismTaxonId)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        qtlStudy: async (trait, _, { dataSources }) => {
            if (trait.qtlStudyIdentifier != null) {
                return dataSources[sourceName].getQTLStudy(trait.qtlStudyIdentifier)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            }
        },
        gwas: async (trait, _, { dataSources }) => {
            if (trait.gwasIdentifier != null) {
                return dataSources[sourceName].getGWAS(trait.gwasIdentifier)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            }
        },
        qtls: async (trait, { page, pageSize }, { dataSources }) => {
            const { id } = trait;
            return dataSources[sourceName].getQTLsForTrait(id, {page, pageSize})
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        gwasResults: async (trait, { page, pageSize }, { dataSources }) => {
            const { id } = trait;
            return dataSources[sourceName].getGWASResultsForTrait(id, {page, pageSize})
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
