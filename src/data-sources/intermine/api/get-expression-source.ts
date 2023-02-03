// get an ExpressionSource by ID
export async function getExpressionSource(id) {
    const constraints = [this.pathquery.intermineConstraint('ExpressionSource.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineExpressionSourceAttributes,
        this.models.intermineExpressionSourceSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2expressionSources(response))
        .then((expressionSources) => {
            if (!expressionSources.length) {
                const msg = `ExpressionSource with ID '${id}' not found`;
                this.inputError(msg);
            }
            return expressionSources[0];
        });
}
