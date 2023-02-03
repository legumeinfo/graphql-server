// get OntologyAnnotations for any type that extends Annotatable
export async function getOntologyAnnotations({annotatable=null, start=0, size=10}) {
    const constraints = [];
    if (annotatable) {
        const constraint = this.pathquery.intermineConstraint('OntologyAnnotation.subject.id', '=', annotatable.id);
        constraints.push(constraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineOntologyAnnotationAttributes,
        this.models.intermineOntologyAnnotationSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2ontologyAnnotations(response));
}
