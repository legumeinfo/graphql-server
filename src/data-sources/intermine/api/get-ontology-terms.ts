// get OntologyTerms for a Trait
export async function getOntologyTerms({trait=null, start=0, size=10}) {
    const constraints = [];
    if (trait) {
        const traitConstraint = this.pathquery.intermineConstraint('Trait.id', '=', trait.id);
        constraints.push(traitConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineTraitOntologyTermsAttributes,
        this.models.intermineTraitOntologyTermsSort,
        constraints,
    );
    return this.pathQuery(query).then((response) => this.models.response2ontologyTerms(response));
}
