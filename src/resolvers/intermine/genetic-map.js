const geneticMapFactory = (sourceName) => ({
    Query: {
        geneticMap:  async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getGeneticMap(id);
        },
    },
    GeneticMap: {
        organism: async (geneticMap, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getOrganism(geneticMap.organismId);
        },
        linkageGroups: async (geneticMap, { start, size }, { dataSources }) => {
            const args = {
                geneticMap: geneticMap,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getLinkageGroups(args);
        },
    },
});


module.exports = geneticMapFactory;
