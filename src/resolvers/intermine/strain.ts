import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const strainFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        strain: async (_, { identifier }, { dataSources }) => {
            return dataSources[sourceName].getStrain(identifier);
        },
        strains: async (_, { description, origin, species, start, size }, { dataSources }) => {
            const args = {description, origin, species, start, size};
            return dataSources[sourceName].searchStrains(args);
        },
    },
    Strain: {
        organism: async (strain, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(strain.organismTaxonId);
        },
    },
});
