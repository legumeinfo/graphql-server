// get ExpressionSamples for an ExpressionSource
async function getExpressionSamples({expressionSource, start=0, size=10}={}) {
    const constraints = [];
    if (expressionSource) {
        const expressionSourceConstraint = this.pathquery.intermineConstraint('ExpressionSample.source.id', '=', expressionSource.id);
        constraints.push(expressionSourceConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineExpressionSampleAttributes,
        this.models.intermineExpressionSampleSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2expressionSamples(response));
}


module.exports = getExpressionSamples;
