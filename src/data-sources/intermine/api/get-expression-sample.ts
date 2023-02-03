// get an ExpressionSample by ID
export async function getExpressionSample(id) {
    const constraints = [this.pathquery.intermineConstraint('ExpressionSample.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineExpressionSampleAttributes,
        this.models.intermineExpressionSampleSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2expressionSamples(response))
        .then((expressionSamples) => {
            if (!expressionSamples.length) {
                const msg = `ExpressionSample with ID '${id}' not found`;
                this.inputError(msg);
            }
            return expressionSamples[0];
        });
}
