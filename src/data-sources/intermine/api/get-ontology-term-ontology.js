// get the Ontology of an OntologyTerm
async function getOntologyTermOntology(ontologyTerm) {
    const constraints = [ this.pathquery.intermineConstraint('OntologyTerm.id', '=', ontologyTerm.id) ];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineOntologyTermOntologyAttributes,
        this.models.intermineOntologyTermOntologySort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2ontologies(response))
        .then((ontologies) => {
            if (!ontologies.length) {
                // no ontology reference, return a placeholder
                return {
                    'id': 0,
                    'url': null,
                    'name': null,
                }
            } else {
                return ontologies[0];
            }
        });
}

module.exports = getOntologyTermOntology;
