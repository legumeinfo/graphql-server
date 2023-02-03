import { RESTDataSource } from '@apollo/datasource-rest';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { GraphQLError } from 'graphql';

import * as apiMethods from './api/index.js';
import * as pathquery from './intermine.pathquery.js';
import * as models from './models/index.js';


export class IntermineAPI extends RESTDataSource {

    // add the pathquery functions to the API class
    pathquery = pathquery;
    // add the models to the API class
    models = {pathquery, ...models};

    constructor(baseURL) {
        super();
        // set the URL all requests will be sent to
        this.baseURL = baseURL;
        // NOTE: RESTDataSource uses the Web API URL interface to combine the
        // baseURL with a path, e.g. 'query/results'. If the baseURL already
        // ends with a path then the path will be overridden with the path
        // provided by RESTDataSource unless the baseURL ends with a '/'.
        // Furthermore, adding a path to baseURL that starts with a '/' will
        // always override whatever path baseURL already ends with, so here we
        // make sure baseURL ends with a '/' and none of the request paths in
        // the class start with a '/'.
        if (!this.baseURL.endsWith('/')) {
            this.baseURL += '/';
        }
        // add the API functions to the class
        for (const [key, value] of Object.entries(apiMethods)) {
            this[key] = value;
        }
    }

    async pathQuery(query, options={}) {
        const params = {
            query,
            ...options,
            format: 'json',
        };
        return await this.get('query/results', {params});
    }

    async keywordSearch(q, options={}) {
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

    inputError(msg) {
      throw new GraphQLError(msg, {
        extensions: {
          code: ApolloServerErrorCode.BAD_USER_INPUT,
        },
      });
    }

}
