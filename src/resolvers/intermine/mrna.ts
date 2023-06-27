import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { sequenceFeatureFactory } from './sequence-feature.js';


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
        ...sequenceFeatureFactory(sourceName),
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
    },
});
