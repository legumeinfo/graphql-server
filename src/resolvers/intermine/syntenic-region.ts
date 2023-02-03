export const syntenicRegionFactory = (sourceName) => ({
    Query: {
        syntenicRegion: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getSyntenicRegion(id);
        },
    },
    SyntenicRegion: {
        organism: async (syntenicRegion, { }, { dataSources }) => {
            return dataSources[sourceName].getOrganism(syntenicRegion.organismId);
        },
        strain: async (syntenicRegion, { }, { dataSources }) => {
            return dataSources[sourceName].getStrain(syntenicRegion.strainId);
        },
        syntenyBlock: async (syntenicRegion, { }, { dataSources }) => {
            return dataSources[sourceName].getSyntenyBlock(syntenicRegion.syntenyBlockId);
        },
        dataSets: async (syntenicRegion, { start, size }, { dataSources }) => {
            const args = {
                start,
                size
            };
            return dataSources[sourceName].getDataSetsForBioEntity(syntenicRegion, args);
        },
        locations: async (syntenicRegion, { start, size }, { dataSources }) => {
            const args = {
                sequenceFeature: syntenicRegion,
                start,
                size
            };
            return dataSources[sourceName].getLocations(args);
        },
    },
});
