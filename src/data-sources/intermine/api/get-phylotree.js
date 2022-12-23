// get a Phylotree by ID
async function getPhylotree(id) {
    const constraints = [this.pathquery.intermineConstraint('Phylotree.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.interminePhylotreeAttributes,
        this.models.interminePhylotreeSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2phylotrees(response))
        .then((phylotrees) => {
            if (!phylotrees.length) {
                const msg = `Phylotree with ID '${id}' not found`;
                this.inputError(msg);
            }
            return phylotrees[0];
        });
}


module.exports = getPhylotree;
