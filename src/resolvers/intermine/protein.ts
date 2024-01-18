import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { bioEntityInterfaceFactory } from './bio-entity-interface.js';

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
        ...bioEntityInterfaceFactory(sourceName),
        phylonode: async(protein, _, { dataSources }) => {
            if (protein.phylonodeIdentifier != null) {
                return dataSources[sourceName].getPhylonode(protein.phylonodeIdentifier)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            }
        },
        transcript: async(protein, _, { dataSources }) => {
            return dataSources[sourceName].getTranscript(protein.transcriptIdentifier)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        sequence: async(protein, _, { dataSources }) => {
            return dataSources[sourceName].getSequence(protein.sequenceId)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        genes: async (protein, { page, pageSize }, { dataSources }) => {
            const args = {protein, page, pageSize};
            return dataSources[sourceName].getGenes(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        proteinMatches: async (protein, { page, pageSize }, { dataSources }) => {
            const args = {protein, page, pageSize};
            return dataSources[sourceName].getProteinMatches(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        panGeneSets: async (protein, { page, pageSize }, { dataSources }) => {
            const args = {protein, page, pageSize};
            return dataSources[sourceName].getPanGeneSets(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        geneFamilyAssignments: async (protein, { page, pageSize }, { dataSources }) => {
            const args = {protein, page, pageSize};
            return dataSources[sourceName].getGeneFamilyAssignments(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
