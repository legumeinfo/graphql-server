const ontologyTermFactory = (sourceName) => ({
  Query: {
    ontologyTerm: async (_source, { id }, { dataSources }) => {
      return dataSources[sourceName].getOntologyTerm(id);
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
