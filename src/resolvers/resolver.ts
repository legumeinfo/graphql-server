import { ContextValue } from '../context.js';

import { GraphQLResolveInfoWithCacheControl } from '@apollo/cache-control-types';


export interface Args {
  [name: string]: any;
};


// NOTE: source should actually be the server's rootValue or a GraphQL type, but
// we're not currently set up to specify either of those types
// NOTE: the return type should be a GraphQL type, but we're not currently set
// up to specify that
export type Resolver = (source: any|Function, args: Args, context: ContextValue, info?: GraphQLResolveInfoWithCacheControl) => Promise<any>;


export interface SubfieldResolverMap {
  [field: string]: Resolver;
}


export interface ResolverMap {
  [type: string]: SubfieldResolverMap;
}
