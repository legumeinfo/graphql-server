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
        dataSets: async (location, { start, size }, { dataSources }) => {
            const args = {
                location: location,
                start,
                size
            };
            return dataSources[sourceName].getDataSets(args);
        },
    },
});


module.exports = locationFactory;
