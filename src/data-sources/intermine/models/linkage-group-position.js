// <class name="LinkageGroupPosition" is-interface="true" term="">
// 	<attribute name="position" type="java.lang.Double"/>
// 	<attribute name="markerName" type="java.lang.String"/>
// 	<reference name="linkageGroup" referenced-type="LinkageGroup"/>
// </class>
const intermineLinkageGroupPositionAttributes = [
    'LinkageGroupPosition.id',
    'LinkageGroupPosition.position',
    'LinkageGroupPosition.markerName',
    'LinkageGroupPosition.linkageGroup.id',
];
const intermineLinkageGroupPositionSort = 'LinkageGroupPosition.position';

// type LinkageGroupPosition {
//   id: ID!
//   position: Float
//   markerName: String
//   linkageGroup: LinkageGroup
// }
const graphqlLinkageGroupPositionAttributes = [
    'id',
    'position',
    'markerName',
    'linkageGroupId',
];

function response2linkageGroupPositions(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlLinkageGroupPositionAttributes);
}


module.exports = {
    intermineLinkageGroupPositionAttributes,
    intermineLinkageGroupPositionSort,
    graphqlLinkageGroupPositionAttributes,
    response2linkageGroupPositions,
};
