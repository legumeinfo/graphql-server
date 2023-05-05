import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const pathwayFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        pathway: async (_, { identifier }, { dataSources }) => {
            const pathway = dataSources[sourceName].getPathway(identifier);
            if (pathway == null) {
                const msg = `Pathway with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return pathway;
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
