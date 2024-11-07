import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap, SubfieldResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';
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
        ...hasOrganismFactory(sourceName),
        ...hasQTLsFactory(sourceName),
    },
});


export const hasQTLStudyFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    qtlStudy: async (parent, { page, pageSize }, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const args = {page, pageSize};
        const typeName = info.parentType.name;
        switch (typeName) {
            case 'QTL':
                const {qtlStudyIdentifier} = parent;
                request = dataSources[sourceName].getQTLStudy(qtlStudyIdentifier, args);
                break;
            case 'Trait':
                const {identifier} = parent;
                request = dataSources[sourceName].getQTLStudyForTrait(identifier, args);
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});
