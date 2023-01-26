// <class name="Trait" extends="Annotatable" is-interface="true" term="https://browser.planteome.org/amigo/term/TO:0000387">
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="name" type="java.lang.String"/>
// 	<reference name="qtlStudy" referenced-type="QTLStudy"/>
// 	<reference name="gwas" referenced-type="GWAS"/>
// 	<reference name="dataSet" referenced-type="DataSet"/>
// 	<collection name="qtls" referenced-type="QTL" reverse-reference="trait"/>
// 	<collection name="gwasResults" referenced-type="GWASResult" reverse-reference="trait"/>
// </class>

// NOTE: one of Trait.qtlStudy or Trait.gwas is null, so we cannot grab those IDs here.
const intermineTraitAttributes = [
    'Trait.id',
    'Trait.primaryIdentifier',
    'Trait.description',
    'Trait.name',
];
const intermineTraitSort = 'Trait.name';

// type Trait {
//   id: ID!
//   identifier: String!
//   # ontologyAnnotations
//   # publications
//   description: String
//   name: String
//   # qtlStudy: QTLStudy
//   # gwas: GWAS
//   # dataSet
//   qtls: [QTL]
//   gwasResults: [GWASResult]
// }
const graphqlTraitAttributes = [
    'id',
    'identifier',
    'description',
    'name',
];
function response2traits(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlTraitAttributes);
}

module.exports = {
    intermineTraitAttributes,
    intermineTraitSort,
    graphqlTraitAttributes,
    response2traits,
};
