import {DataSources, IntermineAPI} from '../../data-sources/index.js';
import {KeyOfType} from '../../utils/index.js';
import {ResolverMap} from '../resolver.js';
import {hasGeneFamilyFactory} from './gene-family.js';
import {hasOrganismFactory} from './organism.js';

export const geneFamilyTallyFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): ResolverMap => ({
  Query: {
    //geneFamilyTally: async (_, { id }, { dataSources }) => {
    //    const {data: tally} = await dataSources[sourceName].getGeneFamilyTally(id);
    //    if (tally == null) {
    //        const msg = `GeneFamilyTally with ID '${id}' not found`;
    //        inputError(msg);
    //    }
    //    return {results: tally};
    //},
  },
  GeneFamilyTally: {
    ...hasGeneFamilyFactory(sourceName),
    ...hasOrganismFactory(sourceName),
  },
});
