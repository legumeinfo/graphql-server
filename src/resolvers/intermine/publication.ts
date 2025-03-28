import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap, SubfieldResolverMap } from '../resolver.js';

export const publicationFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        publication: async (_, { doi }, { dataSources }) => {
            const {data: publication} = await dataSources[sourceName].getPublication(doi);
            if (publication == null) {
                const msg = `Publication with DOI '${doi}' not found`;
                inputError(msg);
            }
            return {results: publication};
        },
        publications: async (_, { title, page, pageSize }, { dataSources }) => {
            const args = {title, page, pageSize};
            return dataSources[sourceName].searchPublications(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    Publication: {
        authors: async (publication, { page, pageSize }, { dataSources }) => {
            const { id } = publication;
            return dataSources[sourceName].getAuthorsForPublication(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => results);
        },
    },
});

export const hasPublicationsFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    publications: async (parent, { page, pageSize }, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const args = {page, pageSize};

        const interfaces = info.parentType.getInterfaces().map(({name}) => name);
        if (interfaces.includes('Annotatable')) {
            const {id} = parent;
            request = dataSources[sourceName].getPublicationsForAnnotatable(id, args);
        }

        const typeName = info.parentType.name;
        switch (typeName) {
            case 'Author':
            // @ts-ignore: fallthrough case error
            case 'DataSource':
                const {id} = parent;
            case 'Author':
                request = dataSources[sourceName].getPublicationsForAuthor(id, args);
                break;
            case 'DataSource':
                request = dataSources[sourceName].getPublicationsForDataSource(id, args);
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});
