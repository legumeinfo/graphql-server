const proteinDomainFactory = (sourceName) => ({
    Query: {
        proteinDomain: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getProteinDomain(id);
        },
        proteinDomains: async (_source, { description, start, size }, { dataSources }) => {
            const args = {
                description,
                start,
                size,
            };
            return dataSources[sourceName].searchProteinDomains(args);
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
