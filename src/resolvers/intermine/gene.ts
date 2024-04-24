import { DataSources, IntermineAPI, MicroservicesAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { hasGeneFamilyAssignmentsFactory } from './gene-family-assignment.js';
import { hasPanGeneSetsFactory } from './pan-gene-set.js';
import { hasProteinsFactory } from './protein.js';
import { hasProteinDomainsFactory } from './protein-domain.js';
import { sequenceFeatureFactory } from './sequence-feature.js';
import { hasTranscriptsFactory } from './transcript.js';

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
            ...hasGeneFamilyAssignmentsFactory(sourceName),
            ...hasPanGeneSetsFactory(sourceName),
            ...hasProteinsFactory(sourceName),
            ...hasProteinDomainsFactory(sourceName),
            ...hasTranscriptsFactory(sourceName),

            // locations: [Location!]!
            
            // locatedFeatures: [Location!]!
            
            // overlappingFeatures: [SequenceFeature!]!
            
            // childFeatures: [SequenceFeature!]!
            
            // introns: [Intron!]!
            
            flankingRegions: async (gene, { page, pageSize }, { dataSources }) => {
                const {id} = gene;
                const args = {page, pageSize};
                return dataSources[sourceName].getGeneFlankingRegionsForGene(id, args)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            pathways: async (gene, { page, pageSize }, { dataSources }) => {
                const {id} = gene;
                const args = {page, pageSize};
                return dataSources[sourceName].getPathwaysForGene(id, args)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            linkouts: async (gene, _, { dataSources }) => {
                const {identifier} = gene;
                return dataSources[microservicesSource].getLinkoutsForGene(identifier);
            },
        },
    });
