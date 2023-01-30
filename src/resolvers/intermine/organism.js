const organismFactory = (sourceName) => ({
    Query: {
        organism: async (_source, { taxonId }, { dataSources }) => {
            return dataSources[sourceName].getOrganism(taxonId);
        },
        organisms: async (_source, { taxonId, abbreviation, name, genus, species, start, size }, { dataSources }) => {
            const args = {
                taxonId,
                abbreviation,
                name,
                genus,
                species,
                start,
                size
            };
            return dataSources[sourceName].searchOrganisms(args);
        },
    },
    Organism: {
        strains: async (organism, { start, size }, { dataSources }) => {
            const args = {organism, start, size};
            return dataSources[sourceName].getStrains(args);
        },
    },
});


module.exports = organismFactory;
