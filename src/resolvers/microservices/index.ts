// @ts-nocheck

import { mergeResolvers } from '@graphql-tools/merge';

import { DataSources, MicroservicesAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';

import { linkoutsFactory } from './linkouts.js';

const factories = [
    linkoutsFactory,
];

// a factory function that generates resolvers for a specific microservices deployment.
// TODO: our resolver type returned by the factories doesn't match the type
// expected by mergeResolvers
export const microservicesResolverFactory = (sourceName: KeyOfType<DataSources, MicroservicesAPI>) => {
    const sourceResolvers = factories.map((factory) => {
        return factory(sourceName);
    });
    return mergeResolvers(sourceResolvers);
};
