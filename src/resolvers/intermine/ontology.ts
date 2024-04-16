import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { hasDataSetsFactory } from './data-set.js';


export const ontologyFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        ontology: async (_, { name }, { dataSources }) => {
            const {data: ontology} = await dataSources[sourceName].getOntology(name);
            if (ontology == null) {
                const msg = `Ontology with name '${name}' not found`;
                inputError(msg);
            }
            return {results: ontology};
        },
    },
    Ontology: {
        ...hasDataSetsFactory(sourceName),
    }
});
