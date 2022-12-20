const qtlFactory = (sourceName) => ({
  Query: {
    qtl:  async (_source, { id }, { dataSources }) => {
      return dataSources[sourceName].getQTL(id);
    },
  }
});


module.exports = qtlFactory;
