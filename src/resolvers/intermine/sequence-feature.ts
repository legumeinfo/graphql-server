import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { SubfieldResolverMap } from '../resolver.js';
import { bioEntityFactory } from './bio-entity.js';


export const sequenceFeatureFactory =
(sourceName: KeyOfType<DataSources, IntermineAPI>): SubfieldResolverMap => ({
    ...bioEntityFactory(sourceName),
});
