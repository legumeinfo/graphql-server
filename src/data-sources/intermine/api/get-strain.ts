// get a Strain by ID
export async function getStrain(id) {
    const constraints = [this.pathquery.intermineConstraint('Strain.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineStrainAttributes,
        this.models.intermineStrainSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2strains(response))
        .then((strains) => {
            if (!strains.length) {
                const msg = `Strain with ID '${id}' not found`;
                this.inputError(msg);
            }
            return strains[0];
        });
}
