module.exports = {
    
    Query: {

        qtl:  async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getQTL(id);
        },

    }

}
