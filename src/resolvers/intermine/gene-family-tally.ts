export const geneFamilyTallyFactory = (sourceName) => ({
    Query: {
        geneFamilyTally: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getGeneFamilyTally(id);
        },
    },
    GeneFamilyTally : {
        organism: async(geneFamilyTally, { }, { dataSources }) => {
            return dataSources[sourceName].getOrganism(geneFamilyTally.organismId);
        },
        geneFamily: async (geneFamilyTally, { }, { dataSources }) => {
            return dataSources[sourceName].getGeneFamily(geneFamilyTally.geneFamilyId);
        },
    },
});
