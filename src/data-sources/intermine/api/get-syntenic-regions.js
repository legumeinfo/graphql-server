// get SyntenicRegions associated with a SyntenyBlock
async function getSyntenicRegions({syntenyBlock, start=0, size=10}={}) {
    const constraints = [];
    if (syntenyBlock) {
        const constraint = this.pathquery.intermineConstraint('SyntenicRegion.syntenyBlock.id', '=', syntenyBlock.id);
        constraints.push(constraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineSyntenicRegionAttributes,
        this.models.intermineSyntenicRegionSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2syntenicRegions(response));
}


module.exports = getSyntenicRegions;
