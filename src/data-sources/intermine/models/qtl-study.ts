import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineAnnotatable,
  graphqlAnnotatableAttributes,
  intermineAnnotatableAttributesFactory,
} from './annotatable.js';


export const intermineQTLStudyAttributes = [
    ...intermineAnnotatableAttributesFactory('QTLStudy'),
    'QTLStudy.description',
    'QTLStudy.genotypes',
    'QTLStudy.synopsis',
    'QTLStudy.organism.taxonId',
];
export const intermineQTLStudySort = 'QTLStudy.primaryIdentifier';
export type IntermineQTLStudy = [
  ...IntermineAnnotatable,
  string,
  string,
  string,
  number,
];


export const graphqlQTLStudyAttributes = [
    ...graphqlAnnotatableAttributes,
    'description',
    'genotypes',
    'synopsis',
    'organismTaxonId',
];
export type GraphQLQTLStudy = {
  [prop in typeof graphqlQTLStudyAttributes[number]]: string;
}


export type IntermineQTLStudyResponse = IntermineDataResponse<IntermineQTLStudy>;
export function response2qtlStudies(response: IntermineQTLStudyResponse): Array<GraphQLQTLStudy> {
    return response2graphqlObjects(response, graphqlQTLStudyAttributes);
}
