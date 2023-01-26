// get a author by ID
async function getAuthor(id) {
    const constraints = [this.pathquery.intermineConstraint('Author.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineAuthorAttributes,
        this.models.intermineAuthorSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2authors(response))
        .then((authors) => {
            if (!authors.length) {
                const msg = `Author with ID '${id}' not found`;
                this.inputError(msg);
            }
            return authors[0];
        });
}


module.exports = getAuthor;
