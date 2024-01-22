import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';

export const ontologyTermFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        ontologyTerm: async (_, { identifier }, { dataSources }) => {
            const {data: term} = await dataSources[sourceName].getOntologyTerm(identifier);
            if (term == null) {
                const msg = `OntologyTerm with identifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: term};
        },
        ontologyTerms: async (_, { description, page, pageSize }, { dataSources }) => {
            const args = {description, page, pageSize};
            return dataSources[sourceName].searchOntologyTerms(args)
            // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    OntologyTerm: {
        ontology: async (ontologyTerm, _, { dataSources }) => {
            return dataSources[sourceName].getOntology(ontologyTerm.ontologyName)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        relations: async (ontologyTerm, { page, pageSize }, { dataSources }) => {
            const args = {ontologyTerm: ontologyTerm, page, pageSize};
            return dataSources[sourceName].getOntologyTermRelations(args)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        synonyms: async (ontologyTerm, { page, pageSize }, { dataSources }) => {
            const args = {ontologyTerm: ontologyTerm, page, pageSize};
            return dataSources[sourceName].getOntologyTermSynonyms(args)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        ontologyAnnotations: async (ontologyTerm, { page, pageSize }, { dataSources }) => {
            const args = {ontologyTerm: ontologyTerm, page, pageSize};
            return dataSources[sourceName].getOntologyAnnotations(args)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        parents: async (ontologyTerm, { page, pageSize }, { dataSources }) => {
            const args = {ontologyTerm: ontologyTerm, page, pageSize};
            return dataSources[sourceName].getOntologyTermParents(args)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        dataSets: async (ontologyTerm, { page, pageSize }, { dataSources }) => {
            const args = {ontologyTerm, page, pageSize};
            return dataSources[sourceName].getDataSets(args)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        crossReferences: async (ontologyTerm, { page, pageSize }, { dataSources }) => {
            const args = {ontologyTerm: ontologyTerm, page, pageSize};
            return dataSources[sourceName].getOntologyTermCrossReferences(args)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
