import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const pathwayFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        pathway: async (_, { identifier }, { dataSources }) => {
            const {data: pathway} = await dataSources[sourceName].getPathway(identifier);
            if (pathway == null) {
                const msg = `Pathway with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: pathway};
        },
    },
    Pathway: {
        dataSets: async (pathway, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForPathway(pathway, args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        ontologyAnnotations: async (pathway, { start, size }, { dataSources }) => {
            const args = {annotatable: pathway, start, size};
            return dataSources[sourceName].getOntologyAnnotations(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        publications: async (pathway, { start, size }, { dataSources }) => {
            const args = {annotatable: pathway, start, size};
            return dataSources[sourceName].getPublications(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        genes: async (pathway, { start, size }, { dataSources }) => {
            const args = {pathway: pathway, start, size};
            return dataSources[sourceName].getGenes(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
