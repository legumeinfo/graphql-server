import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const traitFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        trait: async (_, { identifier }, { dataSources }) => {
            const trait = dataSources[sourceName].getTrait(identifier);
            if (trait == null) {
                const msg = `Trait with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return trait;
        },
        traits: async (_, { name, start, size }, { dataSources }) => {
            const args = {name, start, size};
            return dataSources[sourceName].searchTraits(args);
        },
    },
    Trait: {
        dataSet: async (trait, _, { dataSources }) => {
            return dataSources[sourceName].getDataSet(trait.dataSetName);
        },
        qtlStudy: async (trait, _, { dataSources }) => {
            return dataSources[sourceName].getQTLStudyForTrait(trait);
        },
        qtls: async (trait, _, { dataSources }) => {
            const args = {trait};
            return dataSources[sourceName].getQTLs(args);
        },
        gwas: async (trait, _, { dataSources }) => {
            return dataSources[sourceName].getGWASForTrait(trait);
        },
        gwasResults: async (trait, _, { dataSources }) => {
            const args = {trait};
            return dataSources[sourceName].getGWASResults(args);
        },
        ontologyAnnotations: async (trait, { start, size }, { dataSources }) => {
            const args = {annotatable: trait, start, size};
            return dataSources[sourceName].getOntologyAnnotations(args);
        },
    },
});
