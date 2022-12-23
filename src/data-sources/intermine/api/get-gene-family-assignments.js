// get GeneFamilyAssignments for a Gene, Protein
async function getGeneFamilyAssignments({gene, protein, start=0, size=10}={}) {
    if (gene) {
        const constraints = [this.pathquery.intermineConstraint('Gene.id', '=', gene.id)];
        const query = this.pathquery.interminePathQuery(
            this.models.intermineGeneGeneFamilyAssignmentsAttributes,
            this.models.intermineGeneGeneFamilyAssignmentsSort,
            constraints,
        );
        return this.pathQuery(query)
            .then((response) => this.models.response2geneFamilyAssignments(response));
    } else if (protein) {
        const constraints = [this.pathquery.intermineConstraint('Protein.id', '=', protein.id)];
        const query = this.pathquery.interminePathQuery(
            this.models.intermineProteinGeneFamilyAssignmentsAttributes,
            this.models.intermineProteinGeneFamilyAssignmentsSort,
            constraints,
        );
        return this.pathQuery(query)
            .then((response) => this.models.response2geneFamilyAssignments(response));
    }
}


module.exports = getGeneFamilyAssignments;
