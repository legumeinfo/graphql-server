// get LinkageGroupPositions for a GeneticMarker
async function getLinkageGroupPositions({geneticMarker, start=0, size=10}={}) {
    const constraints = [];
    if (geneticMarker) {
        const geneticMarkerConstraint = this.pathquery.intermineConstraint('LinkageGroupPosition.id', '=', geneticMarker.linkageGroupPositions.id);
        constraints.push(geneticMarkerConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineLinkageGroupPositionAttributes,
        this.models.intermineLinkageGroupPositionSort,
        constraints,
    );
    return this.pathQuery(query).then((response) => this.models.response2linkageGroupPositions(response));
}


module.exports = getLinkageGroupPositions;
