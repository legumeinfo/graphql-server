import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const proteinDomainFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        proteinDomain: async (_, { identifier }, { dataSources }) => {
            const domain = await dataSources[sourceName].getProteinDomain(identifier);
            if (domain == null) {
                const msg = `ProteinDomain with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return domain;
        },
        proteinDomains: async (_, { description, start, size }, { dataSources }) => {
            const args = {description, start, size};
            return dataSources[sourceName].searchProteinDomains(args);
        },
    },
    ProteinDomain: {
        genes: async (proteinDomain, { start, size }, { dataSources }) => {
            const args = {proteinDomain, start, size};
            return dataSources[sourceName].getGenes(args);
        },
        geneFamilies: async (proteinDomain, { start, size }, { dataSources }) => {
            const args = {proteinDomain, start, size};
            return dataSources[sourceName].getGeneFamilies(args);
        },
        ontologyAnnotations: async (proteinDomain, { start, size }, { dataSources }) => {
            const args = {annotatable: proteinDomain, start, size};
            return dataSources[sourceName].getOntologyAnnotations(args);
        },
    },
});
