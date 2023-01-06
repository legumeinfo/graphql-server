// get Publications associated with an Author or any type that extends Annotatable
async function getPublications({author, annotatable, start=0, size=10}={}) {
    const constraints = [];
    if (author) {
        const constraint = this.pathquery.intermineConstraint('Publication.authors.id', '=', author.id);
        constraints.push(constraint);
    }
    if (annotatable) {
        const constraint = this.pathquery.intermineConstraint('Publication.entities.id', '=', annotatable.id);
        constraints.push(constraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.interminePublicationAttributes,
        this.models.interminePublicationSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2publications(response));
}


module.exports = getPublications;
