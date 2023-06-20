import { DataSources, IntermineAPI, MicroservicesAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const geneFactory =
(
    sourceName: KeyOfType<DataSources, IntermineAPI>,
    microservicesSource: KeyOfType<DataSources, MicroservicesAPI>,
): ResolverMap => ({
    Query: {
        gene: async (_, { identifier }, { dataSources }) => {
            const gene = await dataSources[sourceName].getGene(identifier);
            if (gene == null) {
                const msg = `Gene with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return gene;
        },
        genes: async (_, { description, genus, species, strain, identifier, name, geneFamilyIdentifier, start, size }, { dataSources }) => {
            const args = {description, genus, species, strain, identifier, name, geneFamilyIdentifier, start, size};
            return dataSources[sourceName].searchGenes(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    Gene: {
        organism: async (gene, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(gene.organismTaxonId);
        },
        strain: async (gene, _, { dataSources }) => {
            return dataSources[sourceName].getStrain(gene.strainIdentifier);
        },
        dataSets: async (gene, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForBioEntity(gene, args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
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
        locations: async (gene, { start, size }, { dataSources }) => {
            const args = {sequenceFeature: gene, start, size};
            return dataSources[sourceName].getLocations(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        ontologyAnnotations: async (gene, { start, size }, { dataSources }) => {
            const args = {annotatable: gene, start, size};
            return dataSources[sourceName].getOntologyAnnotations(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        pathways: async (gene, { start, size }, { dataSources }) => {
            const args = {annotatable: gene, start, size};
            return dataSources[sourceName].getPathways(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        publications: async (gene, { start, size }, { dataSources }) => {
            const args = {annotatable: gene, start, size};
            return dataSources[sourceName].getPublications(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        linkouts: async (gene, _, { dataSources }) => {
          const {identifier} = gene;
          return dataSources[microservicesSource].getLinkoutsForGene(identifier);
        },
    },
});
