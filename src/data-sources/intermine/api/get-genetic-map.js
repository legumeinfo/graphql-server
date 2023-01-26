// get a GeneticMap by ID
async function getGeneticMap(id) {
    const constraints = [this.pathquery.intermineConstraint('GeneticMap.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineGeneticMapAttributes,
        this.models.intermineGeneticMapSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2geneticMaps(response))
        .then((geneticMaps) => {
            if (!geneticMaps.length) {
                const msg = `GeneticMap with ID '${id}' not found`;
                this.inputError(msg);
            }
            return geneticMaps[0];
        });
}


module.exports = getGeneticMap;
