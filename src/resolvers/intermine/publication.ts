export const publicationFactory = (sourceName) => ({
    Query: {
        publication: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getPublication(id);
        },
        publications: async (_source, { title, start, size }, { dataSources }) => {
            const args = {
                title,
                start,
                size,
            };
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
