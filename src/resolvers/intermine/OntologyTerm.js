module.exports = {
    
    Query: {

        ontologyTerm: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getOntologyTerm(id);
        },

    },

    OntologyTerm: {
        ontology: async(ontologyTerm, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getOntology(ontologyTerm.ontologyId);
        },
    },

}
