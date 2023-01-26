// get a GeneticMarker by ID
async function getGeneticMarker(id) {
    const constraints = [this.pathquery.intermineConstraint('GeneticMarker.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineGeneticMarkerAttributes,
        this.models.intermineGeneticMarkerSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2geneticMarkers(response))
        .then((geneticMarkers) => {
            if (!geneticMarkers.length) {
                const msg = `GeneticMarker with ID '${id}' not found`;
                this.inputError(msg);
            }
            return geneticMarkers[0];
        });
}


module.exports = getGeneticMarker;
