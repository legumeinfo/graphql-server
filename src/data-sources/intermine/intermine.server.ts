// This file contains functions to help work with Intermine's PathQuery API,
// including functions for building queries and parsing their results.

import { DataSourceConfig, RESTDataSource } from '@apollo/datasource-rest';

import { GraphQLModel, IntermineModel } from './models/index.js';
import {
    GraphQLPageInfo,
    GraphQLResultsInfo,
    pageInfoFactory,
    resultsInfoFactory,
} from '../../models/index.js';


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

    // InterMine uses offset pagination but we want to support page-based pagination;
    // this function converts page-based options to offset options
    private convertPaginationOptions({page, pageSize, ...rest}: any={}) {
        if (Number(page) == page && Number(pageSize) == pageSize) {
            return {
                ...rest,
                start: (page-1)*pageSize,
                size: pageSize,
            };
        }
        return rest;
    }

    async pathQuery(query: string, options={}, format='json', summaryPath:string|undefined=undefined) {
        const params = {
            query,
            ...this.convertPaginationOptions(options),
            format,
            summaryPath,
        };
        return await this.get('query/results', {params});
    }

    async pathQueryCount(query: string, options={}) {
        return this.pathQuery(query, options, 'jsoncount');
    }

    async pathQuerySummary(query: string, summaryPath: string, options={}) {
        return this.pathQuery(query, options, 'json', summaryPath);
    }

    async keywordSearch(q: string, options={}) {
        const params = {
            q,
            ...this.convertPaginationOptions(options),
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

}


export interface IntermineDataResponse<I> {
    results: I[];
}


export type IntermineItemSummary = [string, number];


export interface IntermineSummaryResponse {
    uniqueValues: number;
    results: IntermineItemSummary[];
}


export interface IntermineCountResponse {
    count: number;
}


export interface ApiResponse<G> {
  data: G;
  metadata: {
    pageInfo?: GraphQLPageInfo;
  };
}


// creates a Path Query constraint XML string
export const intermineConstraint =
    (path: string, op: string, value: number|string, code: string=''): string => {
        const codeAttr = code ? `code='${code}'` : '';
        return `<constraint path='${path}' ${codeAttr} op='${op}' value='${value}'/>`;
    };


// creates a Path Query NOT NULL constraint XML string
export const intermineNotNullConstraint =
    (path: string, code: string=''): string => {
        const codeAttr = code ? `code='${code}'` : '';
        return `<constraint path='${path}' ${codeAttr} op='IS NOT NULL'/>`;
    };


// creates a Path Query multi-value constraint XML string
export const intermineMultiValueConstraint =
    (path: string, op: string, values: Array<string|number>, code: string=''): string => {
        const valueTags = values.map((value) => `<value>${value}</value>`).join('');
        const codeAttr = code ? `code='${code}'` : '';
        return `<constraint path='${path}' ${codeAttr} op='${op}'>${valueTags}</constraint>`;
    };


// creates a Path Query ONE OF constraint XML string
export const intermineOneOfConstraint =
    (path: string, values: Array<string|number>, code: string=''): string => {
        return intermineMultiValueConstraint(path, 'ONE OF', values, code);
    };


// creates a Path Query NONE OF constraint XML string
export const intermineNoneOfConstraint =
    (path: string, values: Array<string|number>, code: string=''): string => {
        return intermineMultiValueConstraint(path, 'NONE OF', values, code);
    };


// creates a Path Query join XML string; all Path Queries use INNER join by default so OUTER
// is the default here, although INNER is supported for more complex queries
export const intermineJoin =
    (path: string, style: 'INNER'|'OUTER'='OUTER'): string => {
        return `<join path='${path}' style='${style}'/>`;
    };


// creates a Path Query XML string
export const interminePathQuery =
    (viewAttributes: Array<string>, sortBy: string, constraints: Array<string>=[], joins: Array<string>=[], constraintLogic: string=''): string => {
        const view = viewAttributes.join(' ');
        const constraintLogicAttr = constraintLogic ? `constraintLogic='${constraintLogic}'` : '';
        const joinTags = joins.join('');
        const constraintTags = constraints.join('');
        return `<query model='genomic' view='${view}' sortOrder='${sortBy}' ${constraintLogicAttr}>${joinTags}${constraintTags}</query>`;
    };


// converts an InterMine result array into a GraphQL type
export const result2graphqlObject =
    (result: IntermineModel, graphqlAttributes: Array<string>): GraphQLModel => {
        const entries = graphqlAttributes.map((e, i) => [e, result[i]]);
        return Object.fromEntries(entries);
    };


// converts an Intermine response into an array of GraphQL types
// TODO: rename dataResponse2graphqlObjects
export const response2graphqlObjects =
    <I extends IntermineModel>
    (response: IntermineDataResponse<I>, graphqlAttributes: Array<string>):
    Array<GraphQLModel> => {
        return response.results.map(
            (result: I) => result2graphqlObject(result, graphqlAttributes)
        );
    };


// converts an Intermine count response into a GraphQL PageInfo type
export const countResponse2graphqlPageInfo =
    (response: IntermineCountResponse, page: number|null, pageSize: number|null):
    GraphQLPageInfo => {
        const numResults = response.count;
        return pageInfoFactory(numResults, page, pageSize);
    };


// converts an Intermine response into a GraphQL ResultsInfo type
export const summaryResponse2graphqlResultsInfo =
    (response: IntermineSummaryResponse):
    GraphQLResultsInfo => {
        const {uniqueValues, results} = response;
        const reducer = (map: Record<string, number>, [item, count]: IntermineItemSummary) => {
                map[item] = count;
                return map;
            };
        const idCountMap = results.reduce(reducer, {});
        return resultsInfoFactory(uniqueValues, idCountMap);
    };
