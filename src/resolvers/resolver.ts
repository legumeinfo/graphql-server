import type {
  GraphQLScalarType,
  GraphQLFieldResolver,
  GraphQLTypeResolver,
  GraphQLIsTypeOfFn,
} from 'graphql';

export interface GraphQLResolvers {
  [fieldName: string]: (() => any) | GraphQLResolverObject | GraphQLScalarType;
}
// TODO: remove legacy type
export interface ResolverMap extends GraphQLResolvers {}

export type GraphQLResolverObject = {
  [fieldName: string]: GraphQLFieldResolver<any, any> | GraphQLResolverOptions;
};
// TODO: remove legacy type
export type SubfieldResolverMap = GraphQLResolverObject;

export interface GraphQLResolverOptions {
  resolve?: GraphQLFieldResolver<any, any>;
  subscribe?: GraphQLFieldResolver<any, any>;
  __resolveType?: GraphQLTypeResolver<any, any>;
  __isTypeOf?: GraphQLIsTypeOfFn<any, any>;
}
