const organismFactory = (sourceName) => ({
    Query: {
        organism: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getOrganism(id);
        },
        //organisms: async (_source, { genus, start, size }, { dataSources }) => {
        //  const args = {genus, start, size};
        //  return dataSources[sourceName].getOrganisms(args);
        //},
    },
    Organism: {
        strains: async (organism, { start, size }, { dataSources }) => {
            const args = {organism, start, size};
            return dataSources[sourceName].getStrains(args);
        },
    },
});


module.exports = organismFactory;
