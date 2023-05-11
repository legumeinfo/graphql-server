import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const authorFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        author: async (_, { id }, { dataSources }) => {
            const author = await dataSources[sourceName].getAuthor(id);
            if (author == null) {
                const msg = `Author with ID '${id}' not found`;
                inputError(msg);
            }
            return author;
        },
    },
    Author: {
        publications: async (author, { start, size }, { dataSources }) => {
            const args = {author, start, size};
            return dataSources[sourceName].getPublications(args);
        },
    },
});
