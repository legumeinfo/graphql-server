import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap, SubfieldResolverMap } from '../resolver.js';
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
            const {phylonodeIdentifier} = protein;
            if (phylonodeIdentifier != null) {
                return dataSources[sourceName].getPhylonode(phylonodeIdentifier)
                    // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            }
            return null;
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


export const hasProteinFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    protein: async (parent, _, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const interfaces = info.parentType.getInterfaces().map(({name}) => name);
        if (interfaces.includes('Transcript')) {
            const {proteinIdentifier} = parent;
            request = dataSources[sourceName].getProtein(proteinIdentifier)
        }

        const typeName = info.parentType.name;
        switch (typeName) {
            case 'Phylonode':
            case 'ProteinMatch':
                const {proteinIdentifier} = parent;
                request = dataSources[sourceName].getProtein(proteinIdentifier)
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});


export const hasProteinsFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    proteins: async (parent, { page, pageSize }, { dataSources }, info) => {
        let request: Promise<any>|null = null;
        const args = {page, pageSize};

        const typeName = info.parentType.name;
        switch (typeName) {
            case 'Gene':
            // @ts-ignore: fallthrough case error
            case 'PanGeneSet':
                const { id } = parent;
            case 'Gene':
                request = dataSources[sourceName].getProteinsForGene(id, args);
                break;
            case 'PanGeneSet':
                request = dataSources[sourceName].getProteinsForPanGeneSet(id, args);
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});
