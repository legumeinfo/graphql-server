const chromosomeFactory = (sourceName) => ({
    Query: {
        chromosome: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getChromosome(id);
        },
    },
    Chromosome: {
        organism: async (chromosome, { }, { dataSources }) => {
            return dataSources[sourceName].getOrganism(chromosome.organismTaxonId);
        },
        strain: async (chromosome, { }, { dataSources }) => {
            return dataSources[sourceName].getStrain(chromosome.strainIdentifier);
        },
        dataSets: async (chromosome, { start, size }, { dataSources }) => {
            const args = {
                bioEntity: chromosome,
                start,
                size
            };
            return dataSources[sourceName].getDataSets(args);
        },
    },
});


module.exports = chromosomeFactory;
