const chromosomeFactory = (sourceName) => ({
    Query: {
        chromosome: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getChromosome(id);
        },
        // chromosomes: async (_source, { description, start, size }, { dataSources }) => {
        //     const args = {
        //         description,
        //         start,
        //         size,
        //     };
        //     return dataSources[sourceName].searchChromosomes(args);
        // },
    },
    Chromosome: {
        organism: async (chromosome, { }, { dataSources }) => {
            return dataSources[sourceName].getOrganism(chromosome.organismId);
        },
        strain: async (chromosome, { }, { dataSources }) => {
            return dataSources[sourceName].getStrain(chromosome.strainId);
        },
    },
});


module.exports = chromosomeFactory;
