import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const traitFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        trait: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getTrait(id);
        },
        traits: async (_source, { name, start, size }, { dataSources }) => {
            const args = {name, start, size};
            return dataSources[sourceName].searchTraits(args);
        },
    },
    Trait: {
        dataSet: async (trait, { }, { dataSources }) => {
            return dataSources[sourceName].getDataSet(trait.dataSetId);
        },
        qtlStudy: async (trait, { }, { dataSources }) => {
            const args = {
                trait: trait
            };
            return dataSources[sourceName].getQTLStudyForTrait(args);
        },
        qtls: async (trait, { }, { dataSources }) => {
            const args = {trait};
            return dataSources[sourceName].getQTLs(args);
        },
        gwas: async (trait, { }, { dataSources }) => {
            return dataSources[sourceName].getGWASForTrait(trait);
        },
        gwasResults: async (trait, { }, { dataSources }) => {
            const args = {trait};
            return dataSources[sourceName].getGWASResults(args);
        },
        ontologyAnnotations: async (trait, { start, size }, { dataSources }) => {
            const args = {annotatable: trait, start, size};
            return dataSources[sourceName].getOntologyAnnotations(args);
        },
    },
});
