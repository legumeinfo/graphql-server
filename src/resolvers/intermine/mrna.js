const mRNAFactory = (sourceName) => ({
    Query: {
        mRNA: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getMRNA(id);
        },
    },
    MRNA: {
        organism: async (mRNA, { }, { dataSources }) => {
            return dataSources[sourceName].getOrganism(mRNA.organismId);
        },
        strain: async (mRNA, { }, { dataSources }) => {
            return dataSources[sourceName].getStrain(mRNA.strainId);
        },
        gene: async (mRNA, { }, { dataSources }) => {
            return dataSources[sourceName].getGene(mRNA.geneId);
        },
        protein: async (mRNA, { }, { dataSources }) => {
            return dataSources[sourceName].getProtein(mRNA.proteinId);
        },
        dataSets: async (mRNA, { start, size }, { dataSources }) => {
            const args = {
                bioEntity: mRNA,
                start,
                size
            };
            return dataSources[sourceName].getDataSets(args);
        },
        locations: async (mRNA, { start, size }, { dataSources }) => {
            const args = {
                sequenceFeature: mRNA,
                start,
                size
            };
            return dataSources[sourceName].getLocations(args);
        },
        ontologyAnnotations: async (mRNA, { start, size }, { dataSources }) => {
            const args = {
                annotatable: mRNA,
                start,
                size
            };
            return dataSources[sourceName].getOntologyAnnotations(args);
        },
        publications: async (mRNA, { start, size }, { dataSources }) => {
            const args = {
                annotatable: mRNA,
                start,
                size
            };
            return dataSources[sourceName].getPublications(args);
        },
    },
});


module.exports = mRNAFactory;
