import { DataSources, IntermineAPI, MicroservicesAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';


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
        genes: async (_, { description, genus, species, strain, identifier, name, geneFamilyIdentifier, start, size }, { dataSources }) => {
            const args = {description, genus, species, strain, identifier, name, geneFamilyIdentifier, start, size};
            return dataSources[sourceName].searchGenes(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    Gene: {
        ...annotatableFactory(sourceName),
        geneFamilyAssignments: async (gene, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getGeneFamilyAssignments(gene, args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        proteinDomains: async (gene, { start, size }, { dataSources }) => {
            const args = {gene, start, size};
            return dataSources[sourceName].getProteinDomains(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        pathways: async (gene, { start, size }, { dataSources }) => {
            const args = {annotatable: gene, start, size};
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
