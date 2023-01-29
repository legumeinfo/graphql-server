const geneticMapFactory = (sourceName) => ({
    Query: {
        geneticMap:  async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getGeneticMap(id);
        },
        geneticMaps: async (_source, { description, start, size }, { dataSources }) => {
            const args = {
                description,
                start,
                size,
            };
            return dataSources[sourceName].searchGeneticMaps(args);
        },
    },
    GeneticMap: {
        organism: async (geneticMap, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getOrganism(geneticMap.organismId);
        },
        dataSets: async (geneticMap, { start, size }, { dataSources }) => {
            const args = {
                geneticMap: geneticMap,
                start,
                size
            };
            return dataSources[sourceName].getDataSets(args);
        },
        linkageGroups: async (geneticMap, { start, size }, { dataSources }) => {
            const args = {
                geneticMap: geneticMap,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getLinkageGroups(args);
        },
        publications: async (geneticMap, { start, size }, { dataSources }) => {
            const args = {
                annotatable: geneticMap,
                start,
                size
            };
            return dataSources[sourceName].getPublications(args);
        },
    },
});


module.exports = geneticMapFactory;
