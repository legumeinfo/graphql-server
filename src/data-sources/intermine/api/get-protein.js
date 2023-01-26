// get a Protein by ID
async function getProtein(id) {
    const constraints = [this.pathquery.intermineConstraint('Protein.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineProteinAttributes,
        this.models.intermineProteinSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2proteins(response))
        .then((proteins) => {
            if (!proteins.length) {
                const msg = `Protein with ID '${id}' not found`;
                this.inputError(msg);
            }
            return proteins[0];
        });
}


module.exports = getProtein;
