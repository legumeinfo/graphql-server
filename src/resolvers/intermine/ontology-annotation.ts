import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { hasDataSetsFactory } from './data-set.js';

export const ontologyAnnotationFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        ontologyAnnotation: async (_, { id }, { dataSources }) => {
            const {data: annotation} = await dataSources[sourceName].getOntologyAnnotation(id);
            if (annotation == null) {
                const msg = `OntologyAnnotation with ID '${id}' not found`;
                inputError(msg);
            }
            return {results: annotation};
        },
    },
    OntologyAnnotation: {
        ...hasDataSetsFactory(sourceName),
        subject: async(ontologyAnnotation, _, { dataSources }) => {
            return dataSources[sourceName].getAnnotatable(ontologyAnnotation.subjectId)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        ontologyTerm: async(ontologyAnnotation, _, { dataSources }) => {
            return dataSources[sourceName].getOntologyTerm(ontologyAnnotation.ontologyTermIdentifier)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
