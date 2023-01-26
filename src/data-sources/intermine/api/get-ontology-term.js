// get an OntologyTerm by ID
async function getOntologyTerm(id) {
    const constraints = [this.pathquery.intermineConstraint('OntologyTerm.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineOntologyTermAttributes,
        this.models.intermineOntologyTermSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2ontologyTerms(response))
        .then((ontologyTerms) => {
            if (!ontologyTerms.length) {
                const msg = `OntologyTerm with ID '${id}' not found`;
                this.inputError(msg);
            }
            return ontologyTerms[0];
        });
}


module.exports = getOntologyTerm;
