const qtlStudyFactory = (sourceName) => ({
    Query: {
        qtlStudy:  async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getQTLStudy(id);
        },
    },
    QTLStudy: {
        organism: async (qtlStudy, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getOrganism(qtlStudy.organismId);
        },

        qtls: async (qtlStudy, { start, size }, { dataSources }) => {
            const args = {
                qtlStudy: qtlStudy,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getQTLs(args);
        },

    }
});


module.exports = qtlStudyFactory;
