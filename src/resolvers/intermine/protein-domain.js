const proteinDomainFactory = (sourceName) => ({
    Query: {
        proteinDomain: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getProteinDomain(id);
        },
    },
    ProteinDomain: {
        genes: async (proteinDomain, { start, size }, { dataSources }) => {
            const args = {proteinDomain, start, size};
            return dataSources[sourceName].getGenes(args);
        },
        geneFamilies: async (proteinDomain, { start, size }, { dataSources }) => {
            const args = {proteinDomain, start, size};
            return dataSources[sourceName].getGeneFamilies(args);
        },
    },
});


module.exports = proteinDomainFactory;
