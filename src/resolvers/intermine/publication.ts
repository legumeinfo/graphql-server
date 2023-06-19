import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const publicationFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        publication: async (_, { doi }, { dataSources }) => {
            const publication = await dataSources[sourceName].getPublication(doi);
            if (publication == null) {
                const msg = `Publication with DOI '${doi}' not found`;
                inputError(msg);
            }
            return publication;
        },
        publications: async (_, { title, start, size }, { dataSources }) => {
            const args = {title, start, size};
            return dataSources[sourceName].searchPublications(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    Publication: {
        authors: async (publication, { start, size }, { dataSources }) => {
            const args = {publication, start, size};
            return dataSources[sourceName].getAuthors(args);
        },
    },
});
