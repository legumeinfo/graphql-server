import { DataSourceConfig, RESTDataSource } from '@apollo/datasource-rest';

import { GraphQLLinkout } from './models/index.js';
import {
    GraphQLGene,
    GraphQLLocation,
    GraphQLGeneFamily,
    GraphQLPanGeneSet,
} from '../intermine/models/index.js';

export type GetLinkoutsOptions = {
    gene?: GraphQLGene;
    location?: GraphQLLocation;
    geneFamily?: GraphQLGeneFamily;
    panGeneSet?: GraphQLPanGeneSet;
}

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
    
    // return linkouts for a Gene, Location, GeneFamily, or PanGeneSet

    // async getLinkouts(
    //     gene: GraphQLGene,
    //     location: GraphQLLocation,
    //     geneFamily: GraphQLGeneFamily,
    //     panGeneSet: GraphQLPanGeneSet
    // ): Promise<GraphQLLinkout[]> {

    async getLinkouts(
        {
            gene,
            location,
            geneFamily,
            panGeneSet
        }: GetLinkoutsOptions,
    ): Promise<GraphQLLinkout[]> {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        if (gene) {
            console.log(gene);
            const options = {
                headers: headers,
                body: JSON.stringify({genes: [gene.identifier]}),
            };
            return await this.post('gene_linkouts', options);
        } else if (location) {
            console.log(location);
            const region = `${location.locatedOnIdentifier}:${location.start}-${location.end}`;
            const options = {
                headers: headers,
                body: JSON.stringify({genomic_regions: [region]}),
            };
            return await this.post('genomic_region_linkouts', options);
        } else if (geneFamily) {
            console.log(geneFamily);
            const options = {
                headers: headers,
                body: JSON.stringify({gene_families: [geneFamily.identifier]}),
            };
            return await this.post('gene_family_linkouts', options);
        } else if (panGeneSet) {
            console.log(panGeneSet);
            const options = {
                headers: headers,
                body: JSON.stringify({pan_gene_sets: [panGeneSet.identifier]}),
            };
            return await this.post('pan_gene_set_linkouts', options);
        } else {
            console.log("ARGUMENT NOT RECOGNIZED");
            return null;
        }
    }

}
