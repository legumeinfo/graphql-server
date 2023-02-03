// path query search for ExpressionSample by description
export async function searchExpressionSamples({description=null, start=0, size=10}) {
    const constraints = [];
    if (description) {
        const descriptionConstraint = this.pathquery.intermineConstraint('ExpressionSample.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
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
