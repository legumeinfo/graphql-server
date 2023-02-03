export const ontologyFactory = (sourceName) => ({
    Query: {
        ontology: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getOntology(id);
        },
    },
    Ontology: {
        dataSets: async (ontology, { start, size }, { dataSources }) => {
            const args = {
                start,
                size
            };
            return dataSources[sourceName].getDataSetsForOntology(ontology, args);
        },
    }
});
