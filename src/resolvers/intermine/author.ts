import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { hasPublicationsFactory } from './publication.js';

// NOTE: we get Author by id because there is no reliable string identifier. Neither
// lastName, firstName, nor name are reliable identifiers for a particular author.
export const authorFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        author: async (_, { id }, { dataSources }) => {
            const {data: author} = await dataSources[sourceName].getAuthor(id);
            if (author == null) {
                const msg = `Author with ID '${id}' not found`;
                inputError(msg);
            }
            return {results: author};
        },
    },
    Author: {
        ...hasPublicationsFactory,
    },
});
