const ontologyTermFactory = (sourceName) => ({
    Query: {
        ontologyTerm: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getOntologyTerm(id);
        },
        ontologyTerms: async (_source, { description, start, size }, { dataSources }) => {
            const args = {
                description,
                start,
                size,
            };
            return dataSources[sourceName].searchOntologyTerms(args);
        },
    },
    OntologyTerm: {
        // Note: ontology is sometimes null so we have to do a secondary query here
        ontology: async (ontologyTerm, { }, { dataSources }) => {
            return dataSources[sourceName].getOntologyTermOntology(ontologyTerm);
        },
    },
});


module.exports = ontologyTermFactory;
