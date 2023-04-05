import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const geneFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        gene: async (_, { identifier }, { dataSources }) => {
            return dataSources[sourceName].getGene(identifier);
        },
        genes: async (_, { description, genus, species, strain, nameOrIdentifier, geneFamilyIdentifier, start, size }, { dataSources }) => {
            const args = {description, genus, species, strain, nameOrIdentifier, geneFamilyIdentifier, start, size};
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
    },
});
