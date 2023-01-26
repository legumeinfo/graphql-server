// <class name="Pathway" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="name" type="java.lang.String"/>
// 	<attribute name="stableIdentifier" type="java.lang.String"/>
// 	<collection name="genes" referenced-type="Gene" reverse-reference="pathways"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// </class>
const interminePathwayAttributes = [
    'Pathway.id',
    'Pathway.primaryIdentifier',
    'Pathway.name',
    'Pathway.stableIdentifier',
];
const interminePathwaySort = 'Pathway.primaryIdentifier';

// type Pathway implements Annotatable {
//   id: ID!
//   identifier: String!
//   ontologyAnnotations: [OntologyAnnotation]
//   publications: [Publication]
//   name: String
//   stableIdentifier: String
//   genes: [Gene]
//   dataSets: [DataSet]
// }
const graphqlPathwayAttributes = [
    'id',
    'identifier',
    'name',
    'stableIdentifier',
];

// converts an Intermine response into an array of GraphQL Pathway objects
function response2pathways(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlPathwayAttributes);
}


module.exports = {
    interminePathwayAttributes,
    interminePathwaySort,
    graphqlPathwayAttributes,
    response2pathways,
}

