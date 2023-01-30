const geneticMarkerFactory = (sourceName) => ({
    Query: {
        geneticMarker:  async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getGeneticMarker(id);
        },
    },
    GeneticMarker: {
        organism: async (geneticMarker, { }, { dataSources }) => {
            return dataSources[sourceName].getOrganism(geneticMarker.organismTaxonId);
        },
        strain: async (geneticMarker, { }, { dataSources }) => {
            return dataSources[sourceName].getStrain(geneticMarker.strainIdentifier);
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
            return dataSources[sourceName].getQTLs(args);
        },
        gwasResults: async (geneticMarker, { start, size }, { dataSources }) => {
            const args = {
                geneticMarker: geneticMarker,
                start,
                size,
            };
            return dataSources[sourceName].getGWASResults(args);
        },
        linkageGroupPositions: async (geneticMarker, { start, size }, { dataSources }) => {
            const args = {
                geneticMarker: geneticMarker,
                start,
                size,
            };
            return dataSources[sourceName].getLinkageGroupPositions(args);
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
