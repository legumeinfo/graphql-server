// get a Phylonode for a Protein
async function getPhylonodeForProtein({protein}={}) {
    if (protein) {
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
}

module.exports = getPhylonodeForProtein;
