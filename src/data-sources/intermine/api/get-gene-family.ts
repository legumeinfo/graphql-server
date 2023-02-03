// get a GeneFamily by ID
export async function getGeneFamily(id) {
    const constraints = [this.pathquery.intermineConstraint('GeneFamily.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineGeneFamilyAttributes,
        this.models.intermineGeneFamilySort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2geneFamilies(response))
        .then((geneFamilies) => {
            if (!geneFamilies.length) {
                const msg = `GeneFamily with ID '${id}' not found`;
                this.inputError(msg);
            }
            return geneFamilies[0];
        });
}
