import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { SubfieldResolverMap } from '../resolver.js';
import { hasDataSetsFactory } from './data-set.js';
import { hasOntologyAnnotationsFactory } from './ontology-annotation.js';

export const isOntologyTermFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    ...hasDataSetsFactory(sourceName),
    ...hasOntologyAnnotationsFactory(sourceName),
    ontology: async (parent, _, { dataSources }) => {
        const {ontologyName} = parent;
        return dataSources[sourceName].getOntology(ontologyName)
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
    relations: async (parent, _, { dataSources }) => {
        const {id} = parent;
        return dataSources[sourceName].getOntologyRelationsForOntologyTerm(id)
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
});
