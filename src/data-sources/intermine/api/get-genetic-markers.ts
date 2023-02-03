// get GeneticMarkers for a QTL
export async function getGeneticMarkers({qtl=null, start=0, size=10}) {
    const constraints = [];
    if (qtl) {
        const qtlConstraint = this.pathquery.intermineConstraint('GeneticMarker.qtls.id', '=', qtl.id);
        constraints.push(qtlConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineGeneticMarkerAttributes,
        this.models.intermineGeneticMarkerSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2geneticMarkers(response));
}
