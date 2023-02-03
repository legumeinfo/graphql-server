export const pathwayFactory = (sourceName) => ({
    Query: {
        pathway: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getPathway(id);
        },
    },
    Pathway: {
        dataSets: async (pathway, { start, size }, { dataSources }) => {
            const args = {
                start,
                size
            };
            return dataSources[sourceName].getDataSetsForPathway(pathway, args);
        },
        ontologyAnnotations: async (pathway, { start, size }, { dataSources }) => {
            const args = {
                annotatable: pathway,
                start,
                size
            };
            return dataSources[sourceName].getOntologyAnnotations(args);
        },
        publications: async (pathway, { start, size }, { dataSources }) => {
            const args = {
                annotatable: pathway,
                start,
                size
            };
            return dataSources[sourceName].getPublications(args);
        },
        genes: async (pathway, { start, size }, { dataSources }) => {
            const args = {
                pathway: pathway,
                start,
                size
            };
            return dataSources[sourceName].getGenes(args);
        },
    },
});
