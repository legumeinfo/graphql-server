import { mergeResolvers } from '@graphql-tools/merge';
import { intermineResolverFactory } from './intermine/index.js';


export const resolvers = mergeResolvers([
  intermineResolverFactory('lisIntermineAPI'),
  // add more resolvers here
  // NOTE: you can't use mergeResolvers with multiple intermine resolvers; you'll
  // have to implement an aggregate resolver so they don't overwrite each other
]);
