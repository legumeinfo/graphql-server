// get a GeneFamilyAssignment by ID
export async function getGeneFamilyAssignment(id) {
    const constraints = [this.pathquery.intermineConstraint('GeneFamilyAssignment.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineGeneFamilyAssignmentAttributes,
        this.models.intermineGeneFamilyAssignmentSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2geneFamilyAssignments(response))
	.then((geneFamilyAssignments) => {
            if (!geneFamilyAssignments.length) {
                const msg = `GeneFamilyAssignment with ID '${id}' not found`;
                this.inputError(msg);
            }
            return geneFamilyAssignments[0];
        });
}
