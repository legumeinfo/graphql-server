// get a Trait by ID
export async function getTrait(id) {
    const constraints = [this.pathquery.intermineConstraint('Trait.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineTraitAttributes,
        this.models.intermineTraitSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2traits(response))
        .then((traits) => {
            if (!traits.length) {
                const msg = `Trait with ID '${id}' not found`;
                this.inputError(msg);
            }
            return traits[0];
        });
}
