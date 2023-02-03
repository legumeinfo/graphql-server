// path query search for Strain by description and/or origin
export async function searchStrains({description=null, origin=null, start=0, size=10}) {
    const constraints = [];
    if (description) {
        const constraint = this.pathquery.intermineConstraint('Strain.description', 'CONTAINS', description);
        constraints.push(constraint);
    }
    if (origin) {
        const constraint = this.pathquery.intermineConstraint('Strain.origin', 'CONTAINS', origin);
        constraints.push(constraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineStrainAttributes,
        this.models.intermineStrainSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2strains(response));
}
