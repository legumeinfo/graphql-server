import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const ontologyFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        ontology: async (_, { name }, { dataSources }) => {
            const ontology = dataSources[sourceName].getOntology(name);
            if (ontology == null) {
                const msg = `Ontology with name '${name}' not found`;
                inputError(msg);
            }
            return ontology;
        },
    },
    Ontology: {
        dataSets: async (ontology, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForOntology(ontology, args);
        },
    }
});
