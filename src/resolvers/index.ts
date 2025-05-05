import {mergeResolvers} from '@graphql-tools/merge';
import {intermineResolverFactory} from './intermine/index.js';
import {microservicesResolverFactory} from './microservices/index.js';

export const resolvers = mergeResolvers([
  intermineResolverFactory('lisIntermineAPI', 'lisMicroservicesAPI'),
  microservicesResolverFactory('lisMicroservicesAPI'),
  // add more resolvers here
  // NOTE: you can't use mergeResolvers with multiple intermine resolvers; you'll
  // have to implement an aggregate resolver so they don't overwrite each other
]);
