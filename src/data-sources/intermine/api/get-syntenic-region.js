// get a SyntenicRegion by ID
async function getSyntenicRegion(id) {
    const constraints = [this.pathquery.intermineConstraint('SyntenicRegion.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineSyntenicRegionAttributes,
        this.models.intermineSyntenicRegionSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2syntenicRegions(response))
        .then((syntenicRegions) => {
            if (!syntenicRegions.length) {
                const msg = `SyntenicRegion with ID '${id}' not found`;
                this.inputError(msg);
            }
            return syntenicRegions[0];
        });
}


module.exports = getSyntenicRegion;
