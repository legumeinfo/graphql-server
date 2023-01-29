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
        dataSets: async (ontologyAnnotation, { start, size }, { dataSources }) => {
            const args = {
                ontologyAnnotation: ontologyAnnotation,
                start,
                size
            };
            return dataSources[sourceName].getDataSets(args);
        },
    },
});


module.exports = ontologyAnnotationFactory;
