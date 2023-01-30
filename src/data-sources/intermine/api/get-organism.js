// get an Organism by Taxon ID
async function getOrganism(taxonId) {
    const constraints = [this.pathquery.intermineConstraint('Organism.taxonId', '=', taxonId)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineOrganismAttributes,
        this.models.intermineOrganismSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2organisms(response))
        .then((organisms) => {
            if (!organisms.length) {
                const msg = `Organism with Taxon ID '${taxonId}' not found`;
                this.inputError(msg);
            }
            return organisms[0];
        });
}


module.exports = getOrganism;
