import { DataSources, MicroservicesAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const linkoutsFactory = (sourceName: KeyOfType<DataSources, MicroservicesAPI>):
ResolverMap => ({
    Query: {
        geneLinkouts: async (_, { identifier }, { dataSources }) => {
            return dataSources[sourceName].getLinkoutsForGene(identifier)
              // @ts-ignore: implicit type any error
              .then((results) => ({results}));
        },
        locationLinkouts: async (_, { identifier, start, end }, { dataSources }) => {
            return dataSources[sourceName].getLinkoutsForLocation(identifier, start, end)
              // @ts-ignore: implicit type any error
              .then((results) => ({results}));
        },
        geneFamilyLinkouts: async (_, { identifier }, { dataSources }) => {
            return dataSources[sourceName].getLinkoutsForGeneFamily(identifier)
              // @ts-ignore: implicit type any error
              .then((results) => ({results}));
        },
        panGeneSetLinkouts: async (_, { identifier }, { dataSources }) => {
            return dataSources[sourceName].getLinkoutsForPanGeneSet(identifier)
              // @ts-ignore: implicit type any error
              .then((results) => ({results}));
        },
    },
});
