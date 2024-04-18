import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { bioEntityFactory } from './bio-entity.js';
import { hasGeneFamilyAssignmentsFactory } from './gene-family-assignment.js';
import { hasPanGeneSetsFactory } from './pan-gene-set.js';


export const proteinFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        protein: async (_, { identifier }, { dataSources }) => {
            const {data: protein} = await dataSources[sourceName].getProtein(identifier);
            if (protein == null) {
                const msg = `Protein with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: protein};
        },
        proteins: async (_, { description, page, pageSize }, { dataSources }) => {
            const args = {description, page, pageSize};
            return dataSources[sourceName].searchProteins(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    Protein: {
        ...bioEntityFactory(sourceName),
        ...hasGeneFamilyAssignmentsFactory(sourceName),
        ...hasPanGeneSetsFactory(sourceName),
        phylonode: async(protein, _, { dataSources }) => {
            return dataSources[sourceName].getPhylonodeForProtein(protein)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        genes: async (protein, { page, pageSize }, { dataSources }) => {
            const {id} = protein;
            const args = {page, pageSize};
            return dataSources[sourceName].getGenesForProtein(id, args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
