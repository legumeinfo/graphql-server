// get Locations for any type that extends SequenceFeature
async function getLocations({sequenceFeature, start=0, size=10}={}) {
    const constraints = [];
    if (sequenceFeature) {
        const constraint = this.pathquery.intermineConstraint('Location.feature.id', '=', sequenceFeature.id);
        constraints.push(constraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineLocationAttributes,
        this.models.intermineLocationSort,
        constraints,
    );
    return this.pathQuery(query).then((response) => this.models.response2locations(response));
}


module.exports = getLocations;
