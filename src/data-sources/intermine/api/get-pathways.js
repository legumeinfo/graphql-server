// get Pathways associated with a Gene
async function getPathways({gene, start=0, size=10}={}) {
    const constraints = [];
    if (gene) {
        const constraint = this.pathquery.intermineConstraint('Pathway.genes.id', '=', gene.id);
        constraints.push(constraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.interminePathwayAttributes,
        this.models.interminePathwaySort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2pathways(response));
}


module.exports = getPathways;
