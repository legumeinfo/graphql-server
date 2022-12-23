const ontologyFactory = (sourceName) => ({
    Query: {
        ontology: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getOntology(id);
        },
    }
});


module.exports = ontologyFactory;
