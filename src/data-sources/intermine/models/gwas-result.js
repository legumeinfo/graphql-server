// <class name="GWASResult" is-interface="true" term="">
// 	<attribute name="pValue" type="java.lang.Double"/>
//      <attribute name="markerName" type="java.lang.String"/>
// 	<reference name="gwas" referenced-type="GWAS" reverse-reference="results"/>
// 	<reference name="trait" referenced-type="Trait" reverse-reference="gwasResults"/>
// 	<reference name="dataSet" referenced-type="DataSet"/>
// 	<collection name="markers" referenced-type="GeneticMarker" reverse-reference="gwasResults"/>
// </class>
const intermineGWASResultAttributes = [
    'GWASResult.id',
    'GWASResult.pValue',
    'GWASResult.markerName',
    'GWASResult.gwas.id',
    'GWASResult.trait.id',
];
const intermineGWASResultSort = 'GWASResult.markerName';
// type GWASResult {
//   id: ID!
//   pValue: Float
//   markerName: String
//   # gwas: GWAS
//   trait: Trait
//   # dataSet
//   # markers
// }
const graphqlGWASResultAttributes = [
    'id',
    'pValue',
    'markerName',
    'gwasId',
    'traitId',
];
function response2gwasResults(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlGWASResultAttributes);
}


module.exports = {
    intermineGWASResultAttributes,
    intermineGWASResultSort,
    graphqlGWASResultAttributes,
    response2gwasResults,
};
