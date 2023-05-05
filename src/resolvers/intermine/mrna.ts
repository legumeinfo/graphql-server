import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const mRNAFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        mRNA: async (_, { identifier }, { dataSources }) => {
            const mrna = dataSources[sourceName].getMRNA(identifier);
            if (mrna == null) {
                const msg = `mRNA with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return mrna;
        },
    },
    MRNA: {
        organism: async (mRNA, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(mRNA.organismTaxonId);
        },
        strain: async (mRNA, _, { dataSources }) => {
            return dataSources[sourceName].getStrain(mRNA.strainIdentifier);
        },
        gene: async (mRNA, _, { dataSources }) => {
            return dataSources[sourceName].getGene(mRNA.geneIdentifier);
        },
        protein: async (mRNA, _, { dataSources }) => {
            return dataSources[sourceName].getProtein(mRNA.proteinIdentifier);
        },
        dataSets: async (mRNA, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForBioEntity(mRNA, args);
        },
        locations: async (mRNA, _, { dataSources }) => {
            const args = {sequenceFeature: mRNA};
            return dataSources[sourceName].getLocations(args);
        },
        ontologyAnnotations: async (mRNA, { start, size }, { dataSources }) => {
            const args = {annotatable: mRNA, start, size};
            return dataSources[sourceName].getOntologyAnnotations(args);
        },
        publications: async (mRNA, { start, size }, { dataSources }) => {
            const args = {annotatable: mRNA, start, size};
            return dataSources[sourceName].getPublications(args);
        },
    },
});
