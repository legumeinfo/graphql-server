import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const geneFamilyTallyFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        geneFamilyTally: async (_, { id }, { dataSources }) => {
            const {data: tally} = await dataSources[sourceName].getGeneFamilyTally(id);
            if (tally == null) {
                const msg = `GeneFamilyTally with ID '${id}' not found`;
                inputError(msg);
            }
            return {results: tally};
        },
    },
    GeneFamilyTally : {
        organism: async(geneFamilyTally, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(geneFamilyTally.organismTaxonId)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        geneFamily: async (geneFamilyTally, _, { dataSources }) => {
            return dataSources[sourceName].getGeneFamily(geneFamilyTally.geneFamilyIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
