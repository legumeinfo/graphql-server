import { ContextValue } from '../context.js';


export interface Args {
  [name: string]: any;
};


// NOTE: source should actually be the server's rootValue or a GraphQL type, but
// we're not currently set up to specify either of those types
// NOTE: the return type should be a GraphQL type, but we're not currently set
// up to specify that
export type Resolver = (source: any|Function, args: Args, context: ContextValue) => Promise<any>;


export interface ResolverMap {
  [type: string]: {[field: string]: Resolver};
}
