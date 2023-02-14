import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const geneFamilyAssignmentFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        geneFamilyAssignment: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getGeneFamilyAssignment(id);
        },
    },
    GeneFamilyAssignment: {
        geneFamily: async(geneFamilyAssignment, { }, { dataSources }) => {
            return dataSources[sourceName].getGeneFamily(geneFamilyAssignment.geneFamilyId);
        },
    },
});
