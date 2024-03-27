import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';

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
