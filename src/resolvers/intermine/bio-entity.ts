import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { SubfieldResolverMap } from '../resolver.js';
import { isAnnotatableFactory } from './annotatable.js';
import { hasOrganismFactory } from './organism.js';
import { hasStrainFactory } from './strain.js';


export const isBioEntityFactory =
(sourceName: KeyOfType<DataSources, IntermineAPI>): SubfieldResolverMap => ({
    ...isAnnotatableFactory(sourceName),
    ...hasOrganismFactory(sourceName),
    ...hasStrainFactory(sourceName),
    locations: async (bioEntity, { }, { dataSources }) => {
        const {identifier} = bioEntity;
        return dataSources[sourceName].getLocationsForBioEntity(identifier)
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
    locatedFeatures: async (bioEntity, { }, { dataSources }) => {
        const {identifier} = bioEntity;
        return dataSources[sourceName].getLocatedFeaturesForBioEntity(identifier)
            // @ts-ignore: implicit type any error
            .then(({data: results}) => results);
    },
});
