// get an OntologyAnnotation by ID
async function getOntologyAnnotation(id) {
    const constraints = [this.pathquery.intermineConstraint('OntologyAnnotation.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineOntologyAnnotationAttributes,
        this.models.intermineOntologyAnnotationSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2ontologyAnnotations(response))
        .then((ontologyAnnotations) => {
            if (!ontologyAnnotations.length) {
                const msg = `OntologyAnnotation with ID '${id}' not found`;
                this.inputError(msg);
            }
            return ontologyAnnotations[0];
        });
}


module.exports = getOntologyAnnotation;
