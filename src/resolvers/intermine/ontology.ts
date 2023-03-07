import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const ontologyFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        ontology: async (_, { name }, { dataSources }) => {
            return dataSources[sourceName].getOntology(name);
        },
    },
    Ontology: {
        dataSets: async (ontology, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForOntology(ontology, args);
        },
    }
});
