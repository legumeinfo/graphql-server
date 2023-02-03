// path query search for OntologyTerm by description
export async function searchOntologyTerms({description=null, start=0, size=10}) {
    const constraints = [];
    if (description) {
        const descriptionConstraint = this.pathquery.intermineConstraint('OntologyTerm.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineOntologyTermAttributes,
        this.models.intermineOntologyTermSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2ontologyTerms(response));
}
