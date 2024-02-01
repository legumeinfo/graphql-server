import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap, SubfieldResolverMap } from '../resolver.js';
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

export const hasOntologyAnnotationsFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    ontologyAnnotations: async (parent, { page, pageSize }, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        // const typeName = info.parentType.name;
        const args = {page, pageSize};
        const { id } = parent;
        const interfaces = info.parentType.getInterfaces().map(({name}) => name);
        
        // handle any Annotatable
        if (interfaces.includes('Annotatable')) {
            request = dataSources[sourceName].getOntologyAnnotationsForAnnotatable(id, args);
        }

        // handle any OntologyTerm
        if (interfaces.includes('OntologyTerm')) {
            request = dataSources[sourceName].getOntologyAnnotationsForOntologyTerm(id, args);
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});
