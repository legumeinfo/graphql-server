import { IntermineAnnotatable, graphqlAnnotatableAttributes } from './annotatable.js';
import { GraphQLSequenceFeature } from './sequence-feature.js';


export type GraphQLBioEntity =
  GraphQLSequenceFeature;  // all SequenceFeatures are BioEntities


export type IntermineBioEntity = [
    ...IntermineAnnotatable,
    string, // description
    string, // symbol
    string, // name
    string, // assemblyVersion
    string, // annotationVersion
    string, // secondaryIdentifier
    number, // organism.taxonId
    string, // strain.identifier
];

export const graphqlBioEntityAttributes = [
    ...graphqlAnnotatableAttributes,
    'description',         // description
    'symbol',              // symbol
    'name',                // name
    'assemblyVersion',     // assemblyVersion
    'annotationVersion',   // annotationVersion
    'secondaryIdentifier', // secondaryIdentifier
    'organismTaxonId',     // Organism resolution
    'strainIdentifier',    // Strain resolution
];
