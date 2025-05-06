import {DataSources, IntermineAPI} from '../../data-sources/index.js';
import {KeyOfType} from '../../utils/index.js';
import {ResolverMap, SubfieldResolverMap} from '../resolver.js';
import {hasDataSetsFactory} from './data-set.js';

export const ontologyAnnotationFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): ResolverMap => ({
  Query: {
    //ontologyAnnotation: async (_, { id }, { dataSources }) => {
    //    const {data: annotation} = await dataSources[sourceName].getOntologyAnnotation(id);
    //    if (annotation == null) {
    //        const msg = `OntologyAnnotation with ID '${id}' not found`;
    //        inputError(msg);
    //    }
    //    return {results: annotation};
    //},
  },
  OntologyAnnotation: {
    ...hasDataSetsFactory(sourceName),
    //subject: async(ontologyAnnotation, _, { dataSources }) => {
    //    return dataSources[sourceName].getAnnotatable(ontologyAnnotation.subjectId)
    //    // @ts-expect-error: implicit type any error
    //        .then(({data: results}) => results);
    //},
    ontologyTerm: async (ontologyAnnotation, _, {dataSources}) => {
      return (
        dataSources[sourceName]
          .getOntologyTerm(ontologyAnnotation.ontologyTermId)
          // @ts-expect-error: implicit type any error
          .then(({data: results}) => results)
      );
    },
  },
});

export const hasOntologyAnnotationsFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): SubfieldResolverMap => ({
  ontologyAnnotations: async (
    parent,
    {page, pageSize},
    {dataSources},
    info,
  ) => {
    let request: Promise<any> | null = null;

    const args = {page, pageSize};

    const interfaces = info.parentType.getInterfaces().map(({name}) => name);
    if (interfaces.includes('Annotatable')) {
      const {id} = parent;
      request = dataSources[sourceName].getOntologyAnnotationsForAnnotatable(
        id,
        args,
      );
    } else if (interfaces.includes('OntologyTermInterface')) {
      const {id} = parent;
      request = dataSources[sourceName].getOntologyAnnotationsForOntologyTerm(
        id,
        args,
      );
    }

    if (request == null) {
      return null;
    }

    return request.then(({data: results}) => results);
  },
});
