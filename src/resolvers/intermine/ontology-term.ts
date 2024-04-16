import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { hasDataSetsFactory } from './data-set.js';
import { hasOntologyFactory } from './ontology.js';
import { hasOntologyAnnotationsFactory } from './ontology-annotation.js';


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
        ...hasDataSetsFactory(sourceName),
        ...hasOntologyFactory(sourceName),
        ...hasOntologyAnnotationsFactory(sourceName),
    },
});
