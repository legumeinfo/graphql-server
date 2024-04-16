import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { SubfieldResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';
import { hasOrganismFactory } from './organism.js';


export const bioEntityFactory =
(sourceName: KeyOfType<DataSources, IntermineAPI>): SubfieldResolverMap => ({
    ...annotatableFactory(sourceName),
    ...hasOrganismFactory(sourceName),
    strain: async (bioEntity, _, { dataSources }) => {
        return dataSources[sourceName].getStrain(bioEntity.strainIdentifier)
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
    locations: async (bioEntity, { page, pageSize }, { dataSources }) => {
        const {id} = bioEntity;
        const args = {page, pageSize};
        return dataSources[sourceName].getLocationsForBioEntity(id, args)
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
    locatedFeatures: async (bioEntity, { page, pageSize }, { dataSources }) => {
        const {id} = bioEntity;
        return dataSources[sourceName].getLocatedFeaturesForBioEntity(id, {page, pageSize})
        // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
});
