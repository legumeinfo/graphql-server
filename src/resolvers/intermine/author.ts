import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const authorFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        author: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getAuthor(id);
        },
        // authors: async (_source, { description, start, size }, { dataSources }) => {
        //     const args = {description, start, size};
        //     return dataSources[sourceName].searchAuthors(args);
        // },
    },
    Author: {
        publications: async (author, { start, size }, { dataSources }) => {
            const args = {author, start, size};
            return dataSources[sourceName].getPublications(args);
        },
    },
});