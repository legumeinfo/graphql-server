// get GeneFamilyAssignments for a Protein
export async function getGeneFamilyAssignmentsForProtein(protein, {start=0, size=10}) {
    const constraints = [this.pathquery.intermineConstraint('Protein.id', '=', protein.id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineProteinGeneFamilyAssignmentsAttributes,
        this.models.intermineProteinGeneFamilyAssignmentsSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2geneFamilyAssignments(response));
}
