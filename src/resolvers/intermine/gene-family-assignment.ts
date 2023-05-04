import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const geneFamilyAssignmentFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        geneFamilyAssignment: async (_, { id }, { dataSources }) => {
            return dataSources[sourceName].getGeneFamilyAssignment(id);
        },
    },
    GeneFamilyAssignment: {
        geneFamily: async(geneFamilyAssignment, _, { dataSources }) => {
            return dataSources[sourceName].getGeneFamily(geneFamilyAssignment.geneFamilyId);
        },
    },
});
