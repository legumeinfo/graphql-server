// get GeneFamilyAssignments for a Gene
export async function getGeneFamilyAssignments(gene, {start=0, size=10}) {
    const constraints = [this.pathquery.intermineConstraint('Gene.id', '=', gene.id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineGeneGeneFamilyAssignmentsAttributes,
        this.models.intermineGeneGeneFamilyAssignmentsSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2geneFamilyAssignments(response));
}
