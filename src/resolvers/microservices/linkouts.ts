import { DataSources, MicroservicesAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { ResolverMap, SubfieldResolverMap } from '../resolver.js';


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

export const hasLinkoutsFactory = (sourceName: KeyOfType<DataSources, MicroservicesAPI>):
SubfieldResolverMap => ({
    linkouts: async (parent, _, { dataSources }, info) => {
        const typeName = info.parentType.name;
        switch (typeName) {
            case 'Gene':
            case 'GeneFamily':
            // @ts-ignore: fallthrough case error
            case 'PanGeneSet':
                const {identifier} = parent;
            case 'Gene':
                return dataSources[sourceName].getLinkoutsForGene(identifier);
            case 'GeneFamily':
                return dataSources[sourceName].getLinkoutsForGeneFamily(identifier);
            case 'PanGeneSet':
                return dataSources[sourceName].getLinkoutsForPanGeneSet(identifier);
            case 'Location':
                const {locatedOnIdentifier, start, end} = parent;
                return dataSources[sourceName].getLinkoutsForLocation(locatedOnIdentifier, start, end);
        }
        return null;
    },
});
