import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const organismFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        organism: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getOrganism(id);
        },
        organisms: async (_source, { taxonId, abbreviation, name, genus, species, start, size }, { dataSources }) => {
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
        strains: async (organism, { }, { dataSources }) => {
            const args = {organism};
            return dataSources[sourceName].getStrains(args);
        },
    },
});
