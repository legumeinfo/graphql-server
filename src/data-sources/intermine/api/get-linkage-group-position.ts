// get a LinkageGroupPosition by ID
export async function getLinkageGroupPosition(id) {
    const constraints = [this.pathquery.intermineConstraint('LinkageGroupPosition.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineLinkageGroupPositionAttributes,
        this.models.intermineLinkageGroupPositionSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2linkageGroupPositions(response))
        .then((linkageGroupPositions) => {
            if (!linkageGroupPositions.length) {
                const msg = `LinkageGroupPosition with ID '${id}' not found`;
                this.inputError(msg);
            }
            return linkageGroupPositions[0];
        });
}
