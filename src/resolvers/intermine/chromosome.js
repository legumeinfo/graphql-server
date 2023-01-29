const chromosomeFactory = (sourceName) => ({
    Query: {
        chromosome: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getChromosome(id);
        },
    },
    Chromosome: {
        organism: async (chromosome, { }, { dataSources }) => {
            return dataSources[sourceName].getOrganism(chromosome.organismId);
        },
        strain: async (chromosome, { }, { dataSources }) => {
            return dataSources[sourceName].getStrain(chromosome.strainId);
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
