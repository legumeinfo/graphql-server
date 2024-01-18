import { DataSources, IntermineAPI, MicroservicesAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { sequenceFeatureInterfaceFactory } from './sequence-feature-interface.js';

export const geneFactory =
    (
        sourceName: KeyOfType<DataSources, IntermineAPI>,
        microservicesSource: KeyOfType<DataSources, MicroservicesAPI>,
    ): ResolverMap => ({
        Query: {
            gene: async (_, { identifier }, { dataSources }) => {
                const {data: gene} = await dataSources[sourceName].getGene(identifier);
                if (gene == null) {
                    const msg = `Gene with primaryIdentifier '${identifier}' not found`;
                    inputError(msg);
                }
                return {results: gene};
            },
            genes: async (_, { description, genus, species, strain, identifier, name, geneFamilyIdentifier, panGeneSetIdentifier, page, pageSize }, { dataSources }) => {
                const args = {description, genus, species, strain, identifier, name, geneFamilyIdentifier, panGeneSetIdentifier, page, pageSize};
                return dataSources[sourceName].searchGenes(args)
                // @ts-ignore: implicit type any error
                    .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
            },
        },
        Gene: {
            ...sequenceFeatureInterfaceFactory(sourceName),
            upstreamIntergenicRegion: async (gene, _, { dataSources }) => {
                return dataSources[sourceName].getIntergenicRegion(gene.upstreamIntergenicRegionIdentifier)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            downstreamIntergenicRegion: async (gene, _, { dataSources }) => {
                return dataSources[sourceName].getIntergenicRegion(gene.downstreamIntergenicRegionIdentifier)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            flankingRegions: async (gene, { page, pageSize }, { dataSources }) => {
                const args = {gene, page, pageSize};
                return dataSources[sourceName].getGeneFlankingRegions(args)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            transcripts: async (gene, { page, pageSize }, { dataSources }) => {
                const args = {gene, page, pageSize};
                return dataSources[sourceName].getTranscripts(args)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            introns: async (gene, { page, pageSize }, { dataSources }) => {
                const args = {gene, page, pageSize};
                return dataSources[sourceName].getIntrons(args)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            proteins: async (gene, { page, pageSize }, { dataSources }) => {
                const args = {gene, page, pageSize};
                return dataSources[sourceName].getProteins(args)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            pathways: async (gene, { page, pageSize }, { dataSources }) => {
                const args = {gene, page, pageSize};
                return dataSources[sourceName].getPathways(args)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            panGeneSets: async (gene, { page, pageSize }, { dataSources }) => {
                const args = {gene, page, pageSize};
                return dataSources[sourceName].getPanGeneSets(args)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            geneFamilyAssignments: async (gene, { page, pageSize }, { dataSources }) => {
                const args = {gene, page, pageSize};
                return dataSources[sourceName].getGeneFamilyAssignments(args)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            proteinDomains: async (gene, { page, pageSize }, { dataSources }) => {
                const args = {gene, page, pageSize};
                return dataSources[sourceName].getProteinDomains(args)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            linkouts: async (gene, _, { dataSources }) => {
                const {identifier} = gene;
                return dataSources[microservicesSource].getLinkoutsForGene(identifier);
            },
        },
    });
