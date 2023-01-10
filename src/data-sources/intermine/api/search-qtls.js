// path query search for QTLs by Trait.name
async function searchQTLs({traitName, start=0, size=10}={}) {
    const constraints = [];
    if (traitName) {
        const constraint = this.pathquery.intermineConstraint('QTL.trait.name', 'CONTAINS', traitName);
        constraints.push(constraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineQTLAttributes,
        this.models.intermineQTLSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2qtls(response));
}


module.exports = searchQTLs;
