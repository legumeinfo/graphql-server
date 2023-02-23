import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const pathwayFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        pathway: async (_, { identifier }, { dataSources }) => {
            return dataSources[sourceName].getPathway(identifier);
        },
    },
    Pathway: {
        dataSets: async (pathway, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForPathway(pathway, args);
        },
        ontologyAnnotations: async (pathway, { start, size }, { dataSources }) => {
            const args = {annotatable: pathway, start, size};
            return dataSources[sourceName].getOntologyAnnotations(args);
        },
        publications: async (pathway, { start, size }, { dataSources }) => {
            const args = {annotatable: pathway, start, size};
            return dataSources[sourceName].getPublications(args);
        },
        genes: async (pathway, { start, size }, { dataSources }) => {
            const args = {pathway: pathway, start, size};
            return dataSources[sourceName].getGenes(args);
        },
    },
});
