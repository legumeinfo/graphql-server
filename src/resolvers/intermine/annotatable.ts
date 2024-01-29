import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { SubfieldResolverMap } from '../resolver.js';

export const annotatableFactory =
    (sourceName: KeyOfType<DataSources, IntermineAPI>): SubfieldResolverMap => ({
        ontologyAnnotations: async (primaryIdentifier, { page, pageSize }, { dataSources }) => {
            const args = {primaryIdentifier, page, pageSize};
            return dataSources[sourceName].getOntologyAnnotations(args)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        publications: async (primaryIdentifier, { page, pageSize }, { dataSources }) => {
            const args = {primaryIdentifier, page, pageSize};
            return dataSources[sourceName].getPublications(args)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        dataSets: async (primaryIdentifier, { page, pageSize }, { dataSources }) => {
            const args = {primaryIdentifier, page, pageSize};
            return dataSources[sourceName].getDataSets(args)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    });
