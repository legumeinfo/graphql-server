import { DataSources, MicroservicesAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const linkoutsFactory = (sourceName: KeyOfType<DataSources, MicroservicesAPI>):
ResolverMap => ({
    Query: {
        geneLinkout: async (_, { identifier }, { dataSources }) => {
            return dataSources[sourceName].getLinkoutsForGene(identifier);
        },
        locationLinkout: async (_, { identifier, start, end }, { dataSources }) => {
            return dataSources[sourceName].getLinkoutsForLocation(identifier, start, end);
        },
    },
});
