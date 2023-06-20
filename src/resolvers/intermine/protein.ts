import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const proteinFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        protein: async (_, { identifier }, { dataSources }) => {
            const protein = await dataSources[sourceName].getProtein(identifier);
            if (protein == null) {
                const msg = `Protein with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return protein;
        },
        proteins: async (_, { description, start, size }, { dataSources }) => {
            const args = {description, start, size};
            return dataSources[sourceName].searchProteins(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
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
            return dataSources[sourceName].getDataSetsForBioEntity(protein, args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        genes: async (protein, { start, size }, { dataSources }) => {
            const args = {protein, start, size};
            return dataSources[sourceName].getGenes(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        geneFamilyAssignments: async (protein, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getGeneFamilyAssignmentsForProtein(protein, args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
