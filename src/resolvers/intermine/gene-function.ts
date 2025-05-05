import { DataSources, IntermineAPI } from '../../data-sources/index.js';
//import { inputError, KeyOfType } from '../../utils/index.js';
import { KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { isAnnotatableFactory } from './annotatable.js';
import { hasGenesFactory } from './gene.js';
import { hasTraitsFactory } from './trait.js';


export const geneFunctionFactory = 
(
    sourceName: KeyOfType<DataSources, IntermineAPI>,
): ResolverMap => ({
    Query: {
        /*
        geneFunction: async (_, { identifier }, { dataSources }) => {
            const {data: family} = await dataSources[sourceName].getGeneFunction(identifier);
            if (family == null) {
                const msg = `GeneFamily with identifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: family};
        },
        */
        geneFunctions: async (_, { synopsis, page, pageSize }, { dataSources }) => {
            const args = {synopsis, page, pageSize};
            return dataSources[sourceName].searchGeneFunctions(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    GeneFunction: {
        ...isAnnotatableFactory(sourceName),
        ...hasGenesFactory(sourceName),
        ...hasTraitsFactory(sourceName),
    },
});


/*
export const hasGeneFamilyFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    geneFamily: async (parent, _, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const typeName = info.parentType.name;
        switch (typeName) {
            case 'GeneFamilyAssignment':
            case 'GeneFamilyTally':
            // @ts-ignore: fallthrough case error
            case 'Phylotree':
                const {geneFamilyIdentifier} = parent;
                request = dataSources[sourceName].getGeneFamily(geneFamilyIdentifier);
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});
*/
