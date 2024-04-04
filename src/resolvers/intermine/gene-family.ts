import { DataSources, IntermineAPI, MicroservicesAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap, SubfieldResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';


export const geneFamilyFactory = 
    (
        sourceName: KeyOfType<DataSources, IntermineAPI>,
        microservicesSource: KeyOfType<DataSources, MicroservicesAPI>,
    ): ResolverMap => ({
    Query: {
        geneFamily: async (_, { identifier }, { dataSources }) => {
            const {data: family} = await dataSources[sourceName].getGeneFamily(identifier);
            if (family == null) {
                const msg = `GeneFamily with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: family};
        },
        geneFamilies: async (_, { description, page, pageSize }, { dataSources }) => {
            const args = {description, page, pageSize};
            return dataSources[sourceName].searchGeneFamilies(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    GeneFamily: {
        ...annotatableFactory(sourceName),
        phylotree: async(geneFamily, _, { dataSources }) => {
            // phylotrees have the same identifier as their corresponding gene family
            return dataSources[sourceName].getPhylotree(geneFamily.identifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        genes: async (geneFamily, { page, pageSize }, { dataSources }) => {
            const {id} = geneFamily;
            const args = {page, pageSize};
            return dataSources[sourceName].getGenesForGeneFamily(id, args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        proteinDomains: async (geneFamily, { page, pageSize }, { dataSources }) => {
            const args = {geneFamily, page, pageSize};
            return dataSources[sourceName].getProteinDomains(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        tallies: async (geneFamily, { page, pageSize }, { dataSources }) => {
            const {id} = geneFamily;
            const args = {page, pageSize};
            return dataSources[sourceName].getGeneFamilyTalliesForGeneFamily(id, args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        linkouts: async (geneFamily, _, { dataSources }) => {
            const {identifier} = geneFamily;
            return dataSources[microservicesSource].getLinkoutsForGeneFamily(identifier);
        },
    },
});


export const hasGeneFamilyFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    geneFamily: async (parent, _, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const typeName = info.parentType.name;
        switch (typeName) {
            case 'GeneFamilyAssignment':
            case 'GeneFamilyTally':
            // @ts-ignore: fallthrough case error
            case 'Phylotree':
                const {geneFamilyIdentifier} = parent;
                request = dataSources[sourceName].getGeneFamily(geneFamilyIdentifier);
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});
