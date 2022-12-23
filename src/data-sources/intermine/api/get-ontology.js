// get an Ontology by ID
async function getOntology(id) {
    const constraints = [this.pathquery.intermineConstraint('Ontology.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineOntologyAttributes,
        this.models.intermineOntologySort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2ontologies(response))
        .then((ontologies) => {
            if (!ontologies.length) {
                const msg = `Ontology with ID '${id}' not found`;
                this.inputError(msg);
            }
            return ontologies[0];
        });
}


module.exports = getOntology;
