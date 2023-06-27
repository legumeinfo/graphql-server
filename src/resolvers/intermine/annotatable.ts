import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { SubfieldResolverMap } from '../resolver.js';


export const annotatableFactory =
(sourceName: KeyOfType<DataSources, IntermineAPI>): SubfieldResolverMap => ({
    ontologyAnnotations: async (annotatable, { page, pageSize }, { dataSources }) => {
        const args = {annotatable, page, pageSize};
        return dataSources[sourceName].getOntologyAnnotations(args)
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
    publications: async (annotatable, { page, pageSize }, { dataSources }) => {
        const args = {annotatable, page, pageSize};
        return dataSources[sourceName].getPublications(args)
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
});
