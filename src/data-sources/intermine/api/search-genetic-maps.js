// path query search for GeneticMap by description
async function searchGeneticMaps({description, start=0, size=10}={}) {
    const constraints = [];
    if (description) {
        const descriptionConstraint = this.pathquery.intermineConstraint('GeneticMap.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineGeneticMapAttributes,
        this.models.intermineGeneticMapSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2geneticMaps(response));
}


module.exports = searchGeneticMaps;
