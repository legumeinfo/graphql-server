import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const ontologyAnnotationFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        ontologyAnnotation: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getOntologyAnnotation(id);
        },
    },
    OntologyAnnotation: {
        ontologyTerm: async(ontologyAnnotation, { }, { dataSources }) => {
            return dataSources[sourceName].getOntologyTerm(ontologyAnnotation.ontologyTermId);
        },
        dataSets: async (ontologyAnnotation, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForOntologyAnnotation(ontologyAnnotation, args);
        },
    },
});
