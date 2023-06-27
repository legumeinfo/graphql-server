import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const strainFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        strain: async (_, { identifier }, { dataSources }) => {
            const {data: strain} = await dataSources[sourceName].getStrain(identifier);
            if (strain == null) {
                const msg = `Strain with identifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: strain};
        },
        strains: async (_, { description, origin, species, page, pageSize }, { dataSources }) => {
            const args = {description, origin, species, page, pageSize};
            return dataSources[sourceName].searchStrains(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    Strain: {
        organism: async (strain, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(strain.organismTaxonId)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
