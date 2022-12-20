const traitFactory = (sourceName) => ({
  Query: {
    trait: async (_source, { id }, { dataSources }) => {
      return dataSources[sourcename].getTrait(id);
    },
    //traits: async (_source, { description, start, size }, { dataSources }) => {
    //  const args = {description, start, size};
    //  return dataSources[sourcename].getTraits(args);
    //},
    //traitSearch: async (_source, { keyword, start, size }, { dataSources }) => {
    //  const args = {start, size};
    //  return dataSources[sourcename].traitSearch(keyword, args);
    //},
  },
  Trait: {
    ontologyTerms: async (trait, { start, size }, { dataSources }) => {
      const args = {trait, start, size};
      return dataSources[sourcename].getOntologyTerms(args);
    },
    gwasResults: async (trait, { start, size }, { dataSources }) => {
        const args = {trait, start, size};
        return dataSources[sourcename].getGWASResults(args);
    },
  },
});


module.exports = traitFactory;
