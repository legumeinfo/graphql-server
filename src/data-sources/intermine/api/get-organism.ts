// get an Organism by ID
export async function getOrganism(id) {
    const constraints = [this.pathquery.intermineConstraint('Organism.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineOrganismAttributes,
        this.models.intermineOrganismSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2organisms(response))
        .then((organisms) => {
            if (!organisms.length) {
                const msg = `Organism with ID '${id}' not found`;
                this.inputError(msg);
            }
            return organisms[0];
        });
}
