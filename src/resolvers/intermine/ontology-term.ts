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
        ontologyTerms: async (_, { description, start, size }, { dataSources }) => {
            const args = {description, start, size};
            return dataSources[sourceName].searchOntologyTerms(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    OntologyTerm: {
        // Note: ontology is sometimes null so we have to do a secondary query here
        ontology: async (ontologyTerm, _, { dataSources }) => {
            return dataSources[sourceName].getOntologyTermOntology(ontologyTerm)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        dataSets: async (ontologyTerm, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForOntologyTerm(ontologyTerm, args);
        },
    },
});
