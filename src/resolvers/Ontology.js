module.exports = {
    
    Query: {

        ontology: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getOntology(id);
        },

    }

}
