import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const strainFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        strain: async (_, { identifier }, { dataSources }) => {
            const strain = await dataSources[sourceName].getStrain(identifier);
            if (strain == null) {
                const msg = `Strain with identifier '${identifier}' not found`;
                inputError(msg);
            }
            return strain;
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
