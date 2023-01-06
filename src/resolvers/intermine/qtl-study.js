const qtlStudyFactory = (sourceName) => ({
    Query: {
        qtlStudy:  async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getQTLStudy(id);
        },
        qtlStudies: async (_source, { description, start, size }, { dataSources }) => {
            const args = {
                description,
                start,
                size,
            };
            return dataSources[sourceName].searchQTLStudies(args);
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
        publications: async (qtlStudy, { start, size }, { dataSources }) => {
            const args = {
                annotatable: qtlStudy,
                start,
                size
            };
            return dataSources[sourceName].getPublications(args);
        },
    }
});


module.exports = qtlStudyFactory;
