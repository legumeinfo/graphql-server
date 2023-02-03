// get a GWASResult by ID
export async function getGWASResult(id) {
    const constraints = [this.pathquery.intermineConstraint('GWASResult.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineGWASResultAttributes,
        this.models.intermineGWASResultSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2gwasResults(response))
        .then((gwasResults) => {
            if (!gwasResults.length) {
                const msg = `GWASResult with ID '${id}' not found`;
                this.inputError(msg);
            }
            return gwasResults[0];
        });
}
