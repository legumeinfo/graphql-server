import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';
import { hasDataSetFactory } from './data-set.js';
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
                const msg = `Trait with primaryIdentifier '${identifier}' not found`;
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
        ...annotatableFactory(sourceName),
        ...hasDataSetFactory(sourceName),
        ...hasGWASFactory(sourceName),
        ...hasGWASResultsFactory(sourceName),
        ...hasOrganismFactory(sourceName),
        ...hasQTLsFactory(sourceName),
        ...hasQTLStudyFactory(sourceName),
    },
});
