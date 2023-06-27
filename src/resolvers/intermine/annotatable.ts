import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { SubfieldResolverMap } from '../resolver.js';


export const annotatableFactory =
(sourceName: KeyOfType<DataSources, IntermineAPI>): SubfieldResolverMap => ({
    ontologyAnnotations: async (annotatable, { start, size }, { dataSources }) => {
        const args = {annotatable, start, size};
        return dataSources[sourceName].getOntologyAnnotations(args)
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
    publications: async (annotatable, { start, size }, { dataSources }) => {
        const args = {annotatable, start, size};
        return dataSources[sourceName].getPublications(args)
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
});
