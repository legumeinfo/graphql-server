const geneFactory = (sourceName) => ({
    Query: {
        gene: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getGene(id);
        },
        genes: async (_source, { description, start, size }, { dataSources }) => {
            const args = {
                description,
                start,
                size,
            };
            return dataSources[sourceName].searchGenes(args);
        },
    },
    Gene: {
        organism: async (gene, { }, { dataSources }) => {
            return dataSources[sourceName].getOrganism(gene.organismId);
        },
        strain: async (gene, { }, { dataSources }) => {
            return dataSources[sourceName].getStrain(gene.strainId);
        },
        geneFamilyAssignments: async (gene, { start, size }, { dataSources }) => {
            const args = {gene, start, size};
            return dataSources[sourceName].getGeneFamilyAssignments(args);
        },
        proteinDomains: async (gene, { start, size }, { dataSources }) => {
            const args = {gene, start, size};
            return dataSources[sourceName].getProteinDomains(args);
        },
    },
});


module.exports = geneFactory;
