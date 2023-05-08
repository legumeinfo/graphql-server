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
        genes: async (_, { description, start, size }, { dataSources }) => {
            const args = {description, start, size};
            return dataSources[sourceName].searchGenes(args);
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
            return dataSources[sourceName].getDataSetsForBioEntity(gene, args);
        },
        geneFamilyAssignments: async (gene, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getGeneFamilyAssignments(gene, args);
        },
        proteinDomains: async (gene, { start, size }, { dataSources }) => {
            const args = {gene, start, size};
            return dataSources[sourceName].getProteinDomains(args);
        },
        locations: async (gene, _, { dataSources }) => {
            const args = {sequenceFeature: gene};
            return dataSources[sourceName].getLocations(args);
        },
        ontologyAnnotations: async (gene, { start, size }, { dataSources }) => {
            const args = {annotatable: gene, start, size};
            return dataSources[sourceName].getOntologyAnnotations(args);
        },
        pathways: async (gene, { start, size }, { dataSources }) => {
            const args = {annotatable: gene, start, size};
            return dataSources[sourceName].getPathways(args);
        },
        publications: async (gene, { start, size }, { dataSources }) => {
            const args = {annotatable: gene, start, size};
            return dataSources[sourceName].getPublications(args);
        },
        linkouts: async (gene, _, { dataSources }) => {
          const {identifier} = gene;
          return dataSources[microservicesSource].getLinkoutsForGene(identifier);
        },
    },
});
