import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { sequenceFeatureInterfaceFactory } from './sequence-feature-interface.js';

export const mRNAFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        mRNA: async (_, { identifier }, { dataSources }) => {
            const {data: mrna} = await dataSources[sourceName].getMRNA(identifier);
            if (mrna == null) {
                const msg = `mRNA with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: mrna};
        },
    },
    MRNA: {
        ...sequenceFeatureInterfaceFactory(sourceName),
        gene: async (mRNA, _, { dataSources }) => {
            return dataSources[sourceName].getGene(mRNA.geneIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        protein: async (mRNA, _, { dataSources }) => {
            return dataSources[sourceName].getProtein(mRNA.proteinIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        panGeneSets: async (mRNA, { page, pageSize }, { dataSources }) => {
            const args = {mRNA, page, pageSize};
            return dataSources[sourceName].getPanGeneSets(args)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
