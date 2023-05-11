import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const supercontigFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        supercontig: async (_, { identifier }, { dataSources }) => {
            const supercontig = await dataSources[sourceName].getSupercontig(identifier);
            if (supercontig == null) {
                const msg = `Supercontig with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return supercontig;
        },
    },
    Supercontig: {
        organism: async (supercontig, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(supercontig.organismTaxonId);
        },
        strain: async (supercontig, _, { dataSources }) => {
            return dataSources[sourceName].getStrain(supercontig.strainIdentifier);
        },
        dataSets: async (supercontig, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForBioEntity(supercontig, args);
        },
    },
});
