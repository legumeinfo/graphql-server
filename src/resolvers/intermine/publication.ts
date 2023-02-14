import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const publicationFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        publication: async (_, { id }, { dataSources }) => {
            return dataSources[sourceName].getPublication(id);
        },
        publications: async (_, { title, start, size }, { dataSources }) => {
            const args = {title, start, size};
            return dataSources[sourceName].searchPublications(args);
        },
    },
    Publication: {
        authors: async (publication, { start, size }, { dataSources }) => {
            const args = {publication, start, size};
            return dataSources[sourceName].getAuthors(args);
        },
    },
});
