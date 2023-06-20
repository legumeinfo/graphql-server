import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const geneFamilyAssignmentFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        geneFamilyAssignment: async (_, { id }, { dataSources }) => {
            const {data: family} = await dataSources[sourceName].getGeneFamilyAssignment(id);
            if (family == null) {
                const msg = `GeneFamilyAssignment with ID '${id}' not found`;
                inputError(msg);
            }
            return {results: family};
        },
    },
    GeneFamilyAssignment: {
        geneFamily: async(geneFamilyAssignment, _, { dataSources }) => {
            return dataSources[sourceName].getGeneFamily(geneFamilyAssignment.geneFamilyIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
