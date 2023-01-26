// get Authors associated with an Publication
async function getAuthors({publication, start=0, size=10}={}) {
    const constraints = [];
    if (publication) {
        const publicationConstraint = this.pathquery.intermineConstraint('Author.publications.id', '=', publication.id);
        constraints.push(publicationConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineAuthorAttributes,
        this.models.intermineAuthorSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2authors(response));
}


module.exports = getAuthors;
