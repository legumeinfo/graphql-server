// get GeneFamilyTallies associated with a GeneFamily
async function getGeneFamilyTallies({geneFamily, start=0, size=10}={}) {
    const constraints = [];
    if (geneFamily) {
        const geneFamilyConstraint = this.pathquery.intermineConstraint('GeneFamilyTally.geneFamily.id', '=', geneFamily.id);
        constraints.push(geneFamilyConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineGeneFamilyTallyAttributes,
        this.models.intermineGeneFamilyTallySort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2geneFamilyTallies(response));
}

module.exports = getGeneFamilyTallies;
