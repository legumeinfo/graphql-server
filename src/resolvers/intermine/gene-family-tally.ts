import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const geneFamilyTallyFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        geneFamilyTally: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getGeneFamilyTally(id);
        },
    },
    GeneFamilyTally : {
        organism: async(geneFamilyTally, { }, { dataSources }) => {
            return dataSources[sourceName].getOrganism(geneFamilyTally.organismId);
        },
        geneFamily: async (geneFamilyTally, { }, { dataSources }) => {
            return dataSources[sourceName].getGeneFamily(geneFamilyTally.geneFamilyId);
        },
    },
});
