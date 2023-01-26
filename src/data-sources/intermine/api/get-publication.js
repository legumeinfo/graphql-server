// get a publication by ID
async function getPublication(id) {
    const constraints = [this.pathquery.intermineConstraint('Publication.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.interminePublicationAttributes,
        this.models.interminePublicationSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2publications(response))
        .then((publications) => {
            if (!publications.length) {
                const msg = `Publication with ID '${id}' not found`;
                this.inputError(msg);
            }
            return publications[0];
        });
}


module.exports = getPublication;
