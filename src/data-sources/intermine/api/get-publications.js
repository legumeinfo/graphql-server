// get Publications associated with an Author
async function getPublications({author, start=0, size=10}={}) {
    const constraints = [];
    if (author) {
        const authorConstraint = this.pathquery.intermineConstraint('Publication.authors.id', '=', author.id);
        constraints.push(authorConstraint);
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
