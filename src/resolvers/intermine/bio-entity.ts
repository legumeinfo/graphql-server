import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { SubfieldResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';


export const bioEntityFactory =
(sourceName: KeyOfType<DataSources, IntermineAPI>): SubfieldResolverMap => ({
    ...annotatableFactory(sourceName),
    organism: async (bioEntity, _, { dataSources }) => {
        return dataSources[sourceName].getOrganism(bioEntity.organismTaxonId)
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
    strain: async (bioEntity, _, { dataSources }) => {
        return dataSources[sourceName].getStrain(bioEntity.strainIdentifier)
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
    locations: async (bioEntity, { start, size }, { dataSources }) => {
        const args = {sequenceFeature: bioEntity, start, size};
        return dataSources[sourceName].getLocations(args)
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
    dataSets: async (bioEntity, { start, size }, { dataSources }) => {
        const args = {start, size};
        return dataSources[sourceName].getDataSetsForBioEntity(bioEntity, args)
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
});
