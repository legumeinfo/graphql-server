import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';
import { hasDataSetFactory } from './data-set.js';
import { hasOrganismFactory } from './organism.js';
import { hasQTLsFactory } from './qtl.js';


export const qtlStudyFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        qtlStudy: async (_, { identifier }, { dataSources }) => {
            const {data: study} = await dataSources[sourceName].getQTLStudy(identifier);
            if (study == null) {
                const msg = `QTLStudy with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: study};
        },
        qtlStudies: async (_, { description, page, pageSize }, { dataSources }) => {
            const args = {description, page, pageSize};
            return dataSources[sourceName].searchQTLStudies(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    QTLStudy: {
        ...annotatableFactory(sourceName),
        ...hasDataSetFactory(sourceName),
        ...hasOrganismFactory(sourceName),
        ...hasQTLsFactory(sourceName),
    },
});
