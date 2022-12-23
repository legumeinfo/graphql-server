const qtlFactory = (sourceName) => ({
    Query: {
        qtl:  async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getQTL(id);
        },
    },
    QTL: {
        trait: async (qtl, { }, { dataSources }) => {
            return dataSources[sourceName].getTrait(qtl.traitId);
        },
        qtlStudy: async (qtl, { }, { dataSources }) => {
            return dataSources[sourceName].getQTLStudy(qtl.qtlStudyId);
        },
        linkageGroup: async (qtl, { }, { dataSources }) => {
            return dataSources[sourceName].getLinkageGroup(qtl.linkageGroupId);
        },
    },
});


module.exports = qtlFactory;
