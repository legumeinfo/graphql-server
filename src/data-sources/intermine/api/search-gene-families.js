// path query search for GeneFamily by description
async function searchGeneFamilies({description, start=0, size=10}={}) {
    const constraints = [];
    if (description) {
        const descriptionConstraint = this.pathquery.intermineConstraint('GeneFamily.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineGeneFamilyAttributes,
        this.models.intermineGeneFamilySort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2geneFamilies(response));
}


module.exports = searchGeneFamilies;
