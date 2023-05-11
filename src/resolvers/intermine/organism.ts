import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const organismFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        organism: async (_, { taxonId }, { dataSources }) => {
            const organism = await dataSources[sourceName].getOrganism(taxonId);
            if (organism == null) {
                const msg = `Organism with taxon ID '${taxonId}' not found`;
                inputError(msg);
            }
            return organism;
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
