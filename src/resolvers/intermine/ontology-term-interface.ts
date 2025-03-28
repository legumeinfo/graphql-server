import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { SubfieldResolverMap } from '../resolver.js';
import { hasDataSetsFactory } from './data-set.js';
import { hasOntologyAnnotationsFactory } from './ontology-annotation.js';

export const isOntologyTermFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    ...hasDataSetsFactory(sourceName),
    ...hasOntologyAnnotationsFactory(sourceName),
    crossReferences: async (ontologyTerm, { page, pageSize }, { dataSources }) => {
        const {id} = ontologyTerm;
        return dataSources[sourceName].getCrossReferencesForOntologyTerm(id, {page, pageSize})
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
    ontology: async (ontologyTerm, _, { dataSources }) => {
        const {ontologyName} = ontologyTerm;
        return dataSources[sourceName].getOntology(ontologyName)
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
    parents: async (ontologyTerm, { page, pageSize }, { dataSources }) => {
        const { id } = ontologyTerm;
        return dataSources[sourceName].getParentsForOntologyTerm(id, {page, pageSize})
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
    relations: async (ontologyTerm, _, { dataSources }) => {
        const {id} = ontologyTerm;
        return dataSources[sourceName].getOntologyRelationsForOntologyTerm(id)
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
    synonyms: async (ontologyTerm, { page, pageSize }, { dataSources }) => {
        const {id} = ontologyTerm;
        return dataSources[sourceName].getOntologyTermSynonymsForOntologyTerm(id, {page, pageSize})
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
});
