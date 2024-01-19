import { DataSources, MicroservicesAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';

import {
    GraphQLGene,
    GraphQLLocation,
    GraphQLGeneFamily,
    GraphQLPanGeneSet,
} from '../../data-sources/intermine/models/index.js';

export const linkoutsFactory = (sourceName: KeyOfType<DataSources, MicroservicesAPI>):
ResolverMap => ({
    Query: {
        geneLinkouts: async (_, { identifier }, { dataSources }) => {
            const gene: GraphQLGene = {
                identifier: identifier,
            }
            return dataSources[sourceName].getLinkouts({gene})
                .then((results) => ({results}));
        },
        locationLinkouts: async (_, { identifier, start, end }, { dataSources }) => {
            const location: GraphQLLocation = {
                locatedOnidentifier: identifier,
                start: start,
                end: end,
            }
            return dataSources[sourceName].getLinkouts({location})
              .then((results) => ({results}));
        },
        geneFamilyLinkouts: async (_, { identifier }, { dataSources }) => {
            const geneFamily: GraphQLGeneFamily = {
                identifier: identifier,
            }
            return dataSources[sourceName].getLinkouts({geneFamily})
              .then((results) => ({results}));
        },
        panGeneSetLinkouts: async (_, { identifier }, { dataSources }) => {
            const panGeneSet: GraphQLPanGeneSet = {
                identifier: identifier,
            }
            return dataSources[sourceName].getLinkouts({panGeneSet})
              .then((results) => ({results}));
        },
    },
});
