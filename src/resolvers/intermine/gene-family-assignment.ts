import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const geneFamilyAssignmentFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        geneFamilyAssignment: async (_, { id }, { dataSources }) => {
            const family = dataSources[sourceName].getGeneFamilyAssignment(id);
            if (family == null) {
                const msg = `GeneFamilyAssignment with ID '${id}' not found`;
                inputError(msg);
            }
            return family;
        },
    },
    GeneFamilyAssignment: {
        geneFamily: async(geneFamilyAssignment, _, { dataSources }) => {
            return dataSources[sourceName].getGeneFamily(geneFamilyAssignment.geneFamilyId);
        },
    },
});
