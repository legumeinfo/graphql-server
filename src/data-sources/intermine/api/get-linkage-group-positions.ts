// get LinkageGroupPositions for a GeneticMarker
export async function getLinkageGroupPositions(geneticMarker, {start=0, size=10}) {
    // no reverse reference in LinkageGroupPosition so query GeneticMarker
    const constraints = [this.pathquery.intermineConstraint('GeneticMarker.id', '=', geneticMarker.id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineGeneticMarkerLinkageGroupPositionsAttributes,
        this.models.intermineGeneticMarkerLinkageGroupPositionsSort,
        constraints,
    );
    return this.pathQuery(query).then((response) => this.models.response2linkageGroupPositions(response));
}
