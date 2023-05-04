import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const proteinFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        protein: async (_, { identifier }, { dataSources }) => {
            return dataSources[sourceName].getProtein(identifier);
        },
        proteins: async (_, { description, start, size }, { dataSources }) => {
            const args = {description, start, size};
            return dataSources[sourceName].searchProteins(args);
        },
    },
    Protein: {
        organism: async(protein, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(protein.organismTaxonId);
        },
        strain: async(protein, _, { dataSources }) => {
            return dataSources[sourceName].getStrain(protein.strainIdentifier);
        },
        phylonode: async(protein, _, { dataSources }) => {
            return dataSources[sourceName].getPhylonodeForProtein(protein);
        },
        dataSets: async (protein, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForBioEntity(protein, args);
        },
        genes: async (protein, { start, size }, { dataSources }) => {
            const args = {protein, start, size};
            return dataSources[sourceName].getGenes(args);
        },
        geneFamilyAssignments: async (protein, _, { dataSources }) => {
            return dataSources[sourceName].getGeneFamilyAssignmentsForProtein(protein);
        },
    },
});
