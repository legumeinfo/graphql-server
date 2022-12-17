module.exports = {
    
    Query: {

        trait: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getTrait(id);
        },

        // traits: async (_source, { description, start, size }, { dataSources }) => {
        //     const args = {
        //         description,
        //         start,
        //         size,
        //     };
        //     return dataSources.lisIntermineAPI.getTraits(args);
        // },

        // traitSearch: async (_source, { keyword, start, size }, { dataSources }) => {
        //     const args = {
        //         start,
        //         size,
        //     };
        //     return dataSources.lisIntermineAPI.traitSearch(keyword, args);
        // },

    },

    Trait: {
        ontologyTerms: async (trait, { start, size }, { dataSources }) => {
            const args = {
                trait: trait,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getOntologyTerms(args);
        },
        gwasResults: async (trait, { start, size }, { dataSources }) => {
            const args = {
                trait: trait,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getGWASResults(args);
        },

    },

}
