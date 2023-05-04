import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const ontologyFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
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
