// This file contains functions to help work with Intermine's PathQuery API,
// including functions for building queries and parsing their results.

import { DataSourceConfig, RESTDataSource } from '@apollo/datasource-rest';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { GraphQLError } from 'graphql';

import { GraphQLModel, IntermineModel } from './models/index.js';


export class IntermineServer extends RESTDataSource {

    constructor(baseURL: string, config: DataSourceConfig={}) {
        super(config);
        // set the URL all requests will be sent to
        this.baseURL = baseURL;
        // NOTE: RESTDataSource uses the Web API URL interface to add paths to
        // the end of the baseURL. If the baseURL already ends with a path then
        // the path will be overridden with the path provided by RESTDataSource
        // unless the baseURL ends with a '/'. Furthermore, adding a path that
        // starts with a '/' to baseURL will always override whatever path
        // baseURL already ends with, so here we make sure baseURL ends with a
        // '/' and note that none of the request paths in this class should
        // start with a '/'.
        if (!this.baseURL.endsWith('/')) {
            this.baseURL += '/';
        }
    }

    async pathQuery(query: string, options={}) {
        const params = {
            query,
            ...options,
            format: 'json',
        };
        return await this.get('query/results', {params});
    }

    async keywordSearch(q: string, options={}) {
        const params = {
            q,
            ...options,
            format: 'json',
        };
        return await this.get('search', {params});
    }

    async webProperties() {
        const params = {
            format: 'json',
        };
        return await this.get('web-properties', {params});
    }

    inputError(msg: string) {
      throw new GraphQLError(msg, {
        extensions: {
          code: ApolloServerErrorCode.BAD_USER_INPUT,
        },
      });
    }

}


export interface Response<I> {
  results: Array<I>;
}


// creates a Path Query constraint XML string
export const intermineConstraint =
(path: string, op: string, value: number|string): string => {
  return `<constraint path='${path}' op='${op}' value='${value}'/>`;
};


// creates a Path Query XML string
export const interminePathQuery =
(viewAttributes: Array<string>, sortBy: string, constraints: Array<string>=[]):
string => {
  const view = viewAttributes.join(' ');
  const constraint = constraints.join('');
  return `<query model='genomic' view='${view}' sortOrder='${sortBy}'>${constraint}</query>`;
};


// converts an InterMine result array into a GraphQL type
export const result2graphqlObject =
(result: IntermineModel, graphqlAttributes: Array<string>): GraphQLModel => {
  const entries = graphqlAttributes.map((e, i) => [e, result[i]]);
  return Object.fromEntries(entries);
};


// converts an Intermine response into an array of GraphQL types
export const response2graphqlObjects =
<I extends IntermineModel>
(response: Response<I>, graphqlAttributes: Array<string>):
Array<GraphQLModel> => {
  //return consolidate(
  //  response.results.map(
  //    (result: I) => result2graphqlObject(result, graphqlAttributes)
  //  )
  //);
  return response.results.map(
      (result: I) => result2graphqlObject(result, graphqlAttributes)
  );
};


// HACK: finds duplicates and merges 
//export const consolidate =
//(possibly_duplicated_obj_list: Array<GraphQLModel>): Array<GraphQLModel> => {
//  const lookup = new Map();
//  for (const obj of possibly_duplicated_obj_list) {
//   const urobj = lookup.get(obj.id);
//   if (urobj) {
//     //HACK:
//     if (obj.hasOwnProperty('proteinDomains')) {
//       urobj.proteinDomains.push({name: obj.proteinDomains});
//     }
//   }
//   else {
//     if (obj.hasOwnProperty('proteinDomains')) {
//       obj.proteinDomains = [{name : obj.proteinDomains}];
//     }
//     lookup.set(obj.id, obj);
//   }
//  }
//  return Array.from(lookup.values());
//};
