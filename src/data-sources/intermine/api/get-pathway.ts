// get a Pathway by ID
export async function getPathway(id) {
    const constraints = [this.pathquery.intermineConstraint('Pathway.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.interminePathwayAttributes,
        this.models.interminePathwaySort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2pathways(response))
        .then((pathways) => {
            if (!pathways.length) {
                const msg = `Pathway with ID '${id}' not found`;
                this.inputError(msg);
            }
            return pathways[0];
        });
}
