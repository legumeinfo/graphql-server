const geneFamilyFactory = (sourceName) => ({
    Query: {
        geneFamily: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getGeneFamily(id);
        },
        geneFamilies: async (_source, { description, start, size }, { dataSources }) => {
            const args = {
                description,
                start,
                size,
            };
         return dataSources[sourceName].searchGeneFamilies(args);
        },
    },
    GeneFamily: {
        phylotree: async(geneFamily, { }, { dataSources }) => {
            return dataSources[sourceName].getPhylotree(geneFamily.phylotreeId);
        },
        genes: async (geneFamily, { start, size }, { dataSources }) => {
            const args = {geneFamily, start, size};
            return dataSources[sourceName].getGenes(args);
        },
        proteinDomains: async (geneFamily, { start, size }, { dataSources }) => {
            const args = {geneFamily, start, size};
            return dataSources[sourceName].getProteinDomains(args);
        },
        tallies: async (geneFamily, { start, size }, { dataSources }) => {
            const args = {geneFamily, start, size};
            return dataSources[sourceName].getGeneFamilyTallies(args);
        },
    },
});


module.exports = geneFamilyFactory;
