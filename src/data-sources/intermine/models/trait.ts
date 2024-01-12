import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// <class name="Trait" extends="Annotatable" is-interface="true" term="https://browser.planteome.org/amigo/term/TO:0000387">
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="name" type="java.lang.String"/>
// 	<reference name="organism" referenced-type="Organism"/>
// 	<reference name="gwas" referenced-type="GWAS"/>
// 	<reference name="qtlStudy" referenced-type="QTLStudy"/>
// 	<collection name="qtls" referenced-type="QTL" reverse-reference="trait"/>
// 	<collection name="gwasResults" referenced-type="GWASResult" reverse-reference="trait"/>
// </class>
export const intermineTraitAttributes = [
    'Trait.id',                // Annotatable
    'Trait.primaryIdentifier', // Annotatable
    'Trait.description',
    'Trait.name',
    'Trait.organism.taxonId',           // resolve reference
    'Trait.gwas.primaryIdentifier',     // resolve reference (may be null)
    'Trait.qtlStudy.primaryIdentifier', // resolve reference (may be null)
];
export const intermineTraitSort = 'Trait.name';

export type IntermineTrait = [
    number, // id
    string, // primaryIdentifier
    string, // description
    string, // name
    number, // organism.taxonId
    string, // gwas.primaryIdentifier
    string, // qtlStudy.primaryIdentifier
];

export const graphqlTraitAttributes = [
    'id',                 // id
    'identifier',         // primaryIdentifier
    'description',        // description
    'name',               // name
    'organismTaxonId',    // resolve Organism
    'gwasIdentifier',     // resolve GWAS (may be null)
    'qtlStudyIdentifier', // resolve QTLStudy (may be null)
];

export type GraphQLTrait = {
    [prop in typeof graphqlTraitAttributes[number]]: string;
}

export type IntermineTraitResponse = IntermineDataResponse<IntermineTrait>;

export function response2traits(response: IntermineTraitResponse): Array<GraphQLTrait> {
    return response2graphqlObjects(response, graphqlTraitAttributes);
}
