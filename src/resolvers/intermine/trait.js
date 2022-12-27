const traitFactory = (sourceName) => ({
    Query: {
        trait: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getTrait(id);
        },
        traits: async (_source, { name, start, size }, { dataSources }) => {
            const args = {name, start, size};
            return dataSources[sourceName].searchTraits(args);
        },
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
