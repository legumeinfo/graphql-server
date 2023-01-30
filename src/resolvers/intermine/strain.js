const strainFactory = (sourceName) => ({
    Query: {
        strain: async (_source, { identifier }, { dataSources }) => {
            return dataSources[sourceName].getStrain(identifier);
        },
        strains: async (_source, { description, origin, start, size }, { dataSources }) => {
            const args = {
                description,
                origin,
                start,
                size,
            };
            return dataSources[sourceName].searchStrains(args);
        },
    },
    Strain: {
        organism: async (strain, { }, { dataSources }) => {
            return dataSources[sourceName].getOrganism(strain.organismTaxonId);
        },
    },
});


module.exports = strainFactory;
