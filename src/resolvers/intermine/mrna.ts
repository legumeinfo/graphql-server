import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


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
        organism: async (mRNA, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(mRNA.organismTaxonId)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        strain: async (mRNA, _, { dataSources }) => {
            return dataSources[sourceName].getStrain(mRNA.strainIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
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
        dataSets: async (mRNA, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForBioEntity(mRNA, args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        locations: async (mRNA, { start, size }, { dataSources }) => {
            const args = {sequenceFeature: mRNA, start, size};
            return dataSources[sourceName].getLocations(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        ontologyAnnotations: async (mRNA, { start, size }, { dataSources }) => {
            const args = {annotatable: mRNA, start, size};
            return dataSources[sourceName].getOntologyAnnotations(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        publications: async (mRNA, { start, size }, { dataSources }) => {
            const args = {annotatable: mRNA, start, size};
            return dataSources[sourceName].getPublications(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
