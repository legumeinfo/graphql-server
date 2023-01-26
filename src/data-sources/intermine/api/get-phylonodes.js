// get Phylonodes for a Phylotree or parent Phylonode
async function getPhylonodes({phylotree, parent, start=0, size=10}={}) {
    const constraints = [];
    if (phylotree) {
        const phylotreeConstraint = this.pathquery.intermineConstraint('Phylonode.tree.id', '=', phylotree.id);
        constraints.push(phylotreeConstraint);
    } else if (parent) {
        const parentConstraint = this.pathquery.intermineConstraint('Phylonode.parent.id', '=', parent.id);
        constraints.push(parentConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.interminePhylonodeAttributes,
        this.models.interminePhylonodeSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2phylonodes(response));
}


module.exports = getPhylonodes;
