import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';


// <class name="Trait" extends="Annotatable" is-interface="true" term="https://browser.planteome.org/amigo/term/TO:0000387">
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="name" type="java.lang.String"/>
// 	<reference name="dataSet" referenced-type="DataSet"/>
// 	<reference name="organism" referenced-type="Organism"/>
// 	<reference name="qtlStudy" referenced-type="QTLStudy"/>
// 	<reference name="gwas" referenced-type="GWAS"/>
// 	<collection name="qtls" referenced-type="QTL" reverse-reference="trait"/>
// 	<collection name="gwasResults" referenced-type="GWASResult" reverse-reference="trait"/>
// </class>

// NOTE: one of Trait.qtlStudy or Trait.gwas is null, so we cannot grab those IDs here.
export const intermineTraitAttributes = [
    'Trait.id',
    'Trait.primaryIdentifier',
    'Trait.description',
    'Trait.name',
    'Trait.dataSet.name',
    'Trait.organism.taxonId', // internal resolution of organism
];
export const intermineTraitSort = 'Trait.name';
export type IntermineTrait = [
    number,
    string,
    string,
    string,
    string,
    string,
];


// type Trait {
// # Annotatable
// id: ID!
// identifier: ID!
// ontologyAnnotations: [OntologyAnnotation!]!
// publications: [Publication!]!
// # Trait
// name: String!
// description: String
// organism: Organism!
// dataSet: DataSet!
// qtlStudy: QTLStudy
// gwas: GWAS
// qtls: [QTL!]!
// gwasResults: [GWASResult!]!
// }
export const graphqlTraitAttributes = [
    'id',
    'identifier',
    'description',
    'name',
    'dataSetName',
    'organismTaxonId', // internal resolution of organism
];
export type GraphQLTrait = {
    [prop in typeof graphqlTraitAttributes[number]]: string;
}


export type IntermineTraitResponse = IntermineDataResponse<IntermineTrait>;
export function response2traits(response: IntermineTraitResponse): Array<GraphQLTrait> {
    return response2graphqlObjects(response, graphqlTraitAttributes);
}
