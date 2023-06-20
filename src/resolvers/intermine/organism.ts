import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const organismFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        organism: async (_, { taxonId }, { dataSources }) => {
            const {data: organism} = await dataSources[sourceName].getOrganism(taxonId);
            if (organism == null) {
                const msg = `Organism with taxon ID '${taxonId}' not found`;
                inputError(msg);
            }
            return {results: organism};
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
            return dataSources[sourceName].searchOrganisms(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    Organism: {
        strains: async (organism, { start, size }, { dataSources }) => {
            const args = {organism, start, size};
            return dataSources[sourceName].getStrains(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
