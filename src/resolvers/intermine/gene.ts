import { DataSources, IntermineAPI, MicroservicesAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { sequenceFeatureFactory } from './sequence-feature.js';

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
            ...sequenceFeatureFactory(sourceName),
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
                const { id } = gene;
                return dataSources[sourceName].getGeneFlankingRegionsForGene(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            transcripts: async (gene, { page, pageSize }, { dataSources }) => {
                const { id } = gene;
                return dataSources[sourceName].getTranscriptsForGene(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            introns: async (gene, { page, pageSize }, { dataSources }) => {
                const { id } = gene;
                return dataSources[sourceName].getIntronsForGene(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            proteins: async (gene, { page, pageSize }, { dataSources }) => {
                const { id } = gene;
                return dataSources[sourceName].getProteinsForGene(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            pathways: async (gene, { page, pageSize }, { dataSources }) => {
                const { id } = gene;
                return dataSources[sourceName].getPathwaysForGene(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            panGeneSets: async (gene, { page, pageSize }, { dataSources }) => {
                const { id } = gene;
                return dataSources[sourceName].getPanGeneSetsForGene(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            geneFamilyAssignments: async (gene, { page, pageSize }, { dataSources }) => {
                const { id } = gene;
                return dataSources[sourceName].getGeneFamilyAssignmentsForGene(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            proteinDomains: async (gene, { page, pageSize }, { dataSources }) => {
                const { id } = gene;
                return dataSources[sourceName].getProteinDomainsForGene(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            // microservices
            linkouts: async (gene, _, { dataSources }) => {
                return dataSources[microservicesSource].getLinkouts({gene});
            },
        },
    });
