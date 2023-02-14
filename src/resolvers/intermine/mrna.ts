import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const mRNAFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        mRNA: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getMRNA(id);
        },
    },
    MRNA: {
        organism: async (mRNA, { }, { dataSources }) => {
            return dataSources[sourceName].getOrganism(mRNA.organismId);
        },
        strain: async (mRNA, { }, { dataSources }) => {
            return dataSources[sourceName].getStrain(mRNA.strainId);
        },
        gene: async (mRNA, { }, { dataSources }) => {
            return dataSources[sourceName].getGene(mRNA.geneId);
        },
        protein: async (mRNA, { }, { dataSources }) => {
            return dataSources[sourceName].getProtein(mRNA.proteinId);
        },
        dataSets: async (mRNA, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForBioEntity(mRNA, args);
        },
        locations: async (mRNA, { }, { dataSources }) => {
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
