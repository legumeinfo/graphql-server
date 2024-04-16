import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap, SubfieldResolverMap } from '../resolver.js';
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


export const hasOntologyFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    ontology: async (parent, _, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const typeName = info.parentType.name;
        switch (typeName) {
            case 'OntologyTerm':
            case 'SOTerm':
                const {ontologyName} = parent;
                request = dataSources[sourceName].getOntology(ontologyName);
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});
