const ontologyFactory = (sourceName) => ({
    Query: {
        ontology: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getOntology(id);
        },
    },
    Ontology: {
        dataSets: async (ontology, { start, size }, { dataSources }) => {
            const args = {
                ontology: ontology,
                start,
                size
            };
            return dataSources[sourceName].getDataSets(args);
        },
    }
});


module.exports = ontologyFactory;
