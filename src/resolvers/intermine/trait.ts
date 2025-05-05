import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap, SubfieldResolverMap } from '../resolver.js';
import { isAnnotatableFactory } from './annotatable.js';
import { hasGWASFactory } from './gwas.js';
import { hasGWASResultsFactory } from './gwas-result.js';
import { hasOrganismFactory } from './organism.js';
import { hasQTLsFactory } from './qtl.js';
import { hasQTLStudyFactory } from './qtl-study.js';


export const traitFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        trait: async (_, { identifier }, { dataSources }) => {
            const {data: trait} = await dataSources[sourceName].getTrait(identifier);
            if (trait == null) {
                const msg = `Trait with identifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: trait};
        },
        traits: async (_, { name, studyType, publicationId, author, page, pageSize }, { dataSources }) => {
            const args = {name, studyType, publicationId, author, page, pageSize};
            return dataSources[sourceName].searchTraits(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    Trait: {
        ...isAnnotatableFactory(sourceName),
        ...hasGWASFactory(sourceName),
        ...hasGWASResultsFactory(sourceName),
        ...hasOrganismFactory(sourceName),
        ...hasQTLsFactory(sourceName),
        ...hasQTLStudyFactory(sourceName),
    },
});


export const hasTraitFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    trait: async (parent, _, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const typeName = info.parentType.name;
        switch (typeName) {
            case 'GWASResult':
            // @ts-ignore: fallthrough case error
            case 'QTL':
                const {traitIdentifier} = parent;
                request = dataSources[sourceName].getTrait(traitIdentifier);
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});

export const hasTraitsFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    traits: async (parent, { page, pageSize }, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const args = {page, pageSize};
        const typeName = info.parentType.name;
        switch (typeName) {
            case 'GeneFunction':
                const {id} = parent;
                console.log("in hasTraitsFactory id is: " + id);
                request = dataSources[sourceName].getTraitsForGeneFunction(id, args);
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});
