// get a location by ID
export async function getLocation(id) {
    const constraints = [this.pathquery.intermineConstraint('Location.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineLocationAttributes,
        this.models.intermineLocationSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2locations(response))
        .then((locations) => {
            if (!locations.length) {
                const msg = `Location with ID '${id}' not found`;
                this.inputError(msg);
            }
            return locations[0];
        });
}
