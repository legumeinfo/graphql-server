// get Strains associated with an Organism
//export async function getStrains({organism=null, start=0, size=10}) {
export async function getStrains({organism=null}) {
    const constraints = [];
    if (organism) {
        const organismConstraint = this.pathquery.intermineConstraint('Strain.organism.id', '=', organism.id);
        constraints.push(organismConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineStrainAttributes,
        this.models.intermineStrainSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2strains(response));
}
