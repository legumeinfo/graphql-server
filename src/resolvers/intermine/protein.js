const proteinFactory = (sourceName) => ({
    Query: {
        protein: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getProtein(id);
        },
        proteins: async (_source, { description, start, size }, { dataSources }) => {
            const args = {
                description,
                start,
                size,
            };
            return dataSources[sourceName].searchProteins(args);
        },
    },
    Protein: {
        organism: async(protein, { }, { dataSources }) => {
            const id = protein.organismId;
            return dataSources[sourceName].getOrganism(id);
        },
        strain: async(protein, { }, { dataSources }) => {
            const id = protein.strainId;
            return dataSources[sourceName].getStrain(id);
        },
        genes: async (protein, { start, size }, { dataSources }) => {
            const args = {protein, start, size};
            return dataSources[sourceName].getGenes(args);
        },
        geneFamilyAssignments: async (protein, { start, size }, { dataSources }) => {
            const args = {protein, start, size};
            return dataSources[sourceName].getGeneFamilyAssignments(args);
        },
    },
});


module.exports = proteinFactory;
