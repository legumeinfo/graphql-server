import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { bioEntityInterfaceFactory } from './bio-entity-interface.js';

// for INTERNAL resolution of BioEntity references and collections
export const bioEntityFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        bioEntity: async (_, { id }, { dataSources }) => {
            const {data: bioEntity} = await dataSources[sourceName].getBioEntity(id);
            if (bioEntity == null) {
                const msg = `BioEntity with id '${id}' not found`;
                inputError(msg);
            }
            return {results: bioEntity};
        },
    },
    BioEntity: {
        ...bioEntityInterfaceFactory(sourceName),
    },
});
