import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const organismFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        organism: async (_, { taxonId }, { dataSources }) => {
            return dataSources[sourceName].getOrganism(taxonId);
        },
        organisms: async (_, { taxonId, abbreviation, name, genus, species, start, size }, { dataSources }) => {
            const args = {
                taxonId,
                abbreviation,
                name,
                genus,
                species,
                start,
                size
            };
            return dataSources[sourceName].searchOrganisms(args);
        },
    },
    Organism: {
        strains: async (organism, _, { dataSources }) => {
            const args = {organism};
            return dataSources[sourceName].getStrains(args);
        },
    },
});
