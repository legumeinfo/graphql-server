// path query search for GWAS by description
async function searchGWASes({description, start=0, size=10}={}) {
    const constraints = [];
    if (description) {
        const descriptionConstraint = this.pathquery.intermineConstraint('GWAS.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineGWASAttributes,
        this.models.intermineGWASSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2gwas(response));
}


module.exports = searchGWASes;
