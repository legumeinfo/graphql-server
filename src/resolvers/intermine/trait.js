const traitFactory = (sourceName) => ({
    Query: {
        trait: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getTrait(id);
        },
        //traits: async (_source, { description, start, size }, { dataSources }) => {
        //  const args = {description, start, size};
        //  return dataSources[sourceName].getTraits(args);
        //},
        //traitSearch: async (_source, { keyword, start, size }, { dataSources }) => {
        //  const args = {start, size};
        //  return dataSources[sourceName].traitSearch(keyword, args);
        //},
    },
    Trait: {
        qtls: async (trait, { start, size }, { dataSources }) => {
            const args = {trait, start, size};
            return dataSources[sourceName].getQTLs(args);
        },
        gwasResults: async (trait, { start, size }, { dataSources }) => {
            const args = {trait, start, size};
            return dataSources[sourceName].getGWASResults(args);
        },
    },
});


module.exports = traitFactory;
