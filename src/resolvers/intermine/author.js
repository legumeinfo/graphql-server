const authorFactory = (sourceName) => ({
    Query: {
        author: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getAuthor(id);
        },
    },
    Author: {
        publications: async (author, { start, size }, { dataSources }) => {
            const args = {author, start, size};
            return dataSources[sourceName].getPublications(args);
        },
    },
});


module.exports = authorFactory;
