import { DataSourceConfig, RESTDataSource } from '@apollo/datasource-rest';

import { GraphQLLinkout } from './models/index.js';


export class MicroservicesAPI extends RESTDataSource {

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

    async getLinkoutsForGene(identifier: string): Promise<GraphQLLinkout[]> {
        const options = {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({genes: [identifier]}),
        };
        return await this.post('gene_linkouts', options);
    }

    async getLinkoutsForLocation(identifier: string, start: number, end: number):
    Promise<GraphQLLinkout[]> {
        const region = `${identifier}:${start}-${end}`;
        const options = {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({genomic_regions: [region]}),
        };
        return await this.post('genomic_region_linkouts', options);
    }

}
