import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { SubfieldResolverMap } from '../resolver.js';
import { hasDataSetsFactory } from './data-set.js';

export const annotatableFactory =
    (sourceName: KeyOfType<DataSources, IntermineAPI>): SubfieldResolverMap => ({
        ...hasDataSetsFactory(sourceName),
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
    });
