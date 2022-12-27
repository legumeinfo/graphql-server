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
        ontology: async(ontologyTerm, { }, { dataSources }) => {
            const id = ontologyTerm.ontologyId;
            return dataSources[sourceName].getOntology(id);
        },
    },
});


module.exports = ontologyTermFactory;
