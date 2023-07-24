import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const newickFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        newick: async (_, { identifier }, { dataSources }) => {
            const {data: newick} = await dataSources[sourceName].getNewick(identifier);
            if (newick == null) {
                const msg = `Newick with identifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: newick};
        },
    },
    Newick: {
        geneFamily: async(newick, _, { dataSources }) => {
            return dataSources[sourceName].getGeneFamily(newick.geneFamilyIdentifier)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        phylotree: async(newick, _, { dataSources }) => {
            return dataSources[sourceName].getPhylotree(newick.phylotreeIdentifier)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
