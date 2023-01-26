// path query search for ExpressionSource by description
async function searchExpressionSources({description, start=0, size=10}={}) {
    const constraints = [];
    if (description) {
        const descriptionConstraint = this.pathquery.intermineConstraint('ExpressionSource.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineExpressionSourceAttributes,
        this.models.intermineExpressionSourceSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2expressionSources(response));
}


module.exports = searchExpressionSources;
