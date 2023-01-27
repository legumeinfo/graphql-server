const geneticMarkerFactory = (sourceName) => ({
    Query: {
        geneticMarker:  async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getGeneticMarker(id);
        },
        // geneticMarkers: async (_source, { description, start, size }, { dataSources }) => {
        //     const args = {
        //         description,
        //         start,
        //         size,
        //     };
        //     return dataSources[sourceName].searchGeneticMarkers(args);
        // },
    },
    GeneticMarker: {
        organism: async (geneticMarker, { }, { dataSources }) => {
            return dataSources[sourceName].getOrganism(geneticMarker.organismId);
        },
        strain: async (geneticMarker, { }, { dataSources }) => {
            return dataSources[sourceName].getStrain(geneticMarker.strainId);
        },
        dataSets: async (geneticMarker, { start, size }, { dataSources }) => {
            const args = {
                bioEntity: geneticMarker,
                start,
                size
            };
            return dataSources[sourceName].getDataSets(args);
        },
        qtls: async (geneticMarker, { start, size }, { dataSources }) => {
            const args = {
                geneticMarker: geneticMarker,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getQTLs(args);
        },
        gwasResults: async (geneticMarker, { start, size }, { dataSources }) => {
            const args = {
                geneticMarker: geneticMarker,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getGWASResults(args);
        },
        linkageGroupPositions: async (geneticMarker, { start, size }, { dataSources }) => {
            const args = {
                geneticMarker: geneticMarker,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getLinkageGroupPositions(args);
        },
        locations: async (geneticMarker, { start, size }, { dataSources }) => {
            const args = {
                sequenceFeature: geneticMarker,
                start,
                size
            };
            return dataSources[sourceName].getLocations(args);
        },
    },
});


module.exports = geneticMarkerFactory;
