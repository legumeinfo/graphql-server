import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


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
        dataSets: async (ontology, { page, pageSize }, { dataSources }) => {
            const args = {bioEntity: ontology, page, pageSize};
            return dataSources[sourceName].getDataSets(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    }
});
