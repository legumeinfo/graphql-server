// get a Phylonode by ID
async function getPhylonode(id) {
    const constraints = [this.pathquery.intermineConstraint('Phylonode.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.interminePhylonodeAttributes,
        this.models.interminePhylonodeSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2phylonodes(response))
        .then((phylonodes) => {
            if (!phylonodes.length) {
                const msg = `Phylonode with ID '${id}' not found`;
                this.inputError(msg);
            }
            return phylonodes[0];
        });
}

// get a Phylonode for a Protein
async function getPhylonode(protein) {
    const constraints = [this.pathquery.intermineConstraint('Phylonode.protein.id', '=', protein.id)];
    const query = this.pathquery.interminePathQuery(
        this.models.interminePhylonodeAttributes,
        this.models.interminePhylonodeSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2phylonodes(response))
        .then((phylonodes) => {
            if (phylonodes.length) {
                return phylonodes[0];
            } else {
                return null;
            }
        });
}


module.exports = getPhylonode;
