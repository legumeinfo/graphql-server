import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const geneFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        gene: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getGene(id);
        },
        genes: async (_source, { description, start, size }, { dataSources }) => {
            const args = {description, start, size};
            return dataSources[sourceName].searchGenes(args);
        },
    },
    Gene: {
        organism: async (gene, { }, { dataSources }) => {
            return dataSources[sourceName].getOrganism(gene.organismId);
        },
        strain: async (gene, { }, { dataSources }) => {
            return dataSources[sourceName].getStrain(gene.strainId);
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
        locations: async (gene, { }, { dataSources }) => {
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
