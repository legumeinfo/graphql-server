const ontologyAnnotationFactory = (sourceName) => ({
    Query: {
        ontologyAnnotation: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getOntologyAnnotation(id);
        },
    },
    OntologyAnnotation: {
        ontologyTerm: async(ontologyAnnotation, { }, { dataSources }) => {
            return dataSources[sourceName].getOntologyTerm(ontologyAnnotation.ontologyTermId);
        },
    },
});


module.exports = ontologyAnnotationFactory;
