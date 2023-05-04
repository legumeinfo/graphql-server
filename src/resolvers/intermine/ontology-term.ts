import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const ontologyTermFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        ontologyTerm: async (_, { identifier }, { dataSources }) => {
            return dataSources[sourceName].getOntologyTerm(identifier);
        },
        ontologyTerms: async (_, { description, start, size }, { dataSources }) => {
            const args = {description, start, size};
            return dataSources[sourceName].searchOntologyTerms(args);
        },
    },
    OntologyTerm: {
        // Note: ontology is sometimes null so we have to do a secondary query here
        ontology: async (ontologyTerm, _, { dataSources }) => {
            return dataSources[sourceName].getOntologyTermOntology(ontologyTerm);
        },
        dataSets: async (ontologyTerm, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForOntologyTerm(ontologyTerm, args);
        },
    },
});
