const publicationFactory = (sourceName) => ({
    Query: {
        publication: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getPublication(id);
        },
        // publications: async (_source, { description, start, size }, { dataSources }) => {
        //     const args = {
        //         description,
        //         start,
        //         size,
        //     };
        //     return dataSources[sourceName].searchPublications(args);
        // },
    },
    Publication: {
        authors: async (publication, { start, size }, { dataSources }) => {
            const args = {publication, start, size};
            return dataSources[sourceName].getAuthors(args);
        },
    },
});


module.exports = publicationFactory;
