const locationFactory = (sourceName) => ({
    Query: {
        location: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getLocation(id);
        },
    },
    Location: {
        chromosome: async (location, { }, { dataSources }) => {
            return dataSources[sourceName].getChromosome(location.chromosomeId);
        },
    },
});


module.exports = locationFactory;
