import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { SubfieldResolverMap } from '../resolver.js';
import { hasDataSetsFactory } from './data-set.js';
import { hasOntologyAnnotationsFactory } from './ontology-annotation.js';
import { hasPublicationsFactory } from './publication.js';


export const isAnnotatableFactory =
(sourceName: KeyOfType<DataSources, IntermineAPI>): SubfieldResolverMap => ({
    ...hasDataSetsFactory(sourceName),
    ...hasOntologyAnnotationsFactory(sourceName),
    ...hasPublicationsFactory(sourceName),
});
