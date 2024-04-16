import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap, SubfieldResolverMap } from '../resolver.js';

// OntologyRelation does not have a string identifier
export const ontologyRelationFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        ontologyRelation: async (_, { id }, { dataSources }) => {
            const {data: ontologyRelation} = await dataSources[sourceName].getOntologyRelation(id);
            if (ontologyRelation == null) {
                const msg = `OntologyRelation with id '${id}' not found`;
                inputError(msg);
            }
            return {results: ontologyRelation};
        },
    },
});


export const hasOntologyRelationsFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    relations: async (parent, _, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const typeName = info.parentType.name;
        switch (typeName) {
            case 'OntologyTerm':
            case 'SOTerm':
                const {id} = parent;
                request = dataSources[sourceName].getOntologyRelationsForOntologyTerm(id);
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});
