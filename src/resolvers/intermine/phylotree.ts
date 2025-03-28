import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap, SubfieldResolverMap } from '../resolver.js';
import { isAnnotatableFactory } from './annotatable.js';
import { hasGeneFamilyFactory } from './gene-family.js';


export const phylotreeFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        phylotree: async (_, { identifier }, { dataSources }) => {
            const {data: tree} = await dataSources[sourceName].getPhylotree(identifier);
            if (tree == null) {
                const msg = `Phylotree with identifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: tree};
        },
    },
    Phylotree: {
        ...isAnnotatableFactory(sourceName),
        ...hasGeneFamilyFactory(sourceName),
        //newick: async(phylotree, _, { dataSources }) => {
        //    return dataSources[sourceName].getNewick(phylotree.identifier)
        //        // @ts-ignore: implicit type any error
        //        .then(({data: newick}) => {
        //            if (newick != null) return newick.contents;
        //            return null;
        //        });
        //},
        nodes: async (phylotree, { page, pageSize }, { dataSources }) => {
            const {id} = phylotree;
            return dataSources[sourceName].getPhylonodesForPhylotree(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});


export const hasPhylotreeFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    phylotree: async (parent, _, { dataSources }, info) => {
        const typeName = info.parentType.name;
        switch (typeName) {
            case 'GeneFamily':
            case 'Phylonode':
                const {phylotreeIdentifier} = parent;
                return dataSources[sourceName].getPhylotree(phylotreeIdentifier)
                    // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
        }

        return null;
    },
});
