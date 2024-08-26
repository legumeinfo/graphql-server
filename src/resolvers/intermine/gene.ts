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
            getGenes: async (_, { identifiers }, { dataSources }) => {
                return dataSources[sourceName].getGenes({identifiers})
                    // @ts-ignore: implicit type any error
                    .then(({data: results}) => ({results}));
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
            proteins: async (gene, { page, pageSize }, { dataSources }) => {
                const args = {gene, page, pageSize};
                return dataSources[sourceName].getProteins(args)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            geneFamilyAssignments: async (gene, { page, pageSize }, { dataSources }) => {
                const args = {page, pageSize};
                return dataSources[sourceName].getGeneFamilyAssignments(gene, args)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            panGeneSets: async (gene, { page, pageSize }, { dataSources }) => {
                const args = {gene, page, pageSize};
                return dataSources[sourceName].getPanGeneSets(args)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            proteinDomains: async (gene, { page, pageSize }, { dataSources }) => {
                const args = {gene, page, pageSize};
                return dataSources[sourceName].getProteinDomains(args)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            pathways: async (gene, { page, pageSize }, { dataSources }) => {
                const args = {annotatable: gene, page, pageSize};
                return dataSources[sourceName].getPathways(args)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            linkouts: async (gene, _, { dataSources }) => {
                const {identifier} = gene;
                return dataSources[microservicesSource].getLinkoutsForGene(identifier);
            },
        },
    });
