import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { SubfieldResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';


export const bioEntityFactory =
(sourceName: KeyOfType<DataSources, IntermineAPI>): SubfieldResolverMap => ({
    ...annotatableFactory(sourceName),
    organism: async (bioEntity, _, { dataSources }) => {
        return dataSources[sourceName].getOrganism(bioEntity)
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
    strain: async (bioEntity, _, { dataSources }) => {
        return dataSources[sourceName].getStrain(bioEntity)
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
    locations: async (bioEntity, { page, pageSize }, { dataSources }) => {
        const args = {bioEntity: bioEntity, page, pageSize};
        return dataSources[sourceName].getLocations(args)
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
    dataSets: async (bioEntity, { page, pageSize }, { dataSources }) => {
        const args = {bioEntity: bioEntity, page, pageSize};
        return dataSources[sourceName].getDataSets(args)
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
    locatedFeatures: async (bioEntity, { page, pageSize }, { dataSources }) => {
        const args = {bioEntity: bioEntity, page, pageSize};
        return dataSources[sourceName].getLocatedFeatures(args)
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
});
