import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const geneFamilyTallyFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        geneFamilyTally: async (_, { id }, { dataSources }) => {
            return dataSources[sourceName].getGeneFamilyTally(id);
        },
    },
    GeneFamilyTally : {
        organism: async(geneFamilyTally, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(geneFamilyTally.organismTaxonId);
        },
        geneFamily: async (geneFamilyTally, _, { dataSources }) => {
            return dataSources[sourceName].getGeneFamily(geneFamilyTally.geneFamilyIdentifier);
        },
    },
});
