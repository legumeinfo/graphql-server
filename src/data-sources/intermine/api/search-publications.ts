// path query search for Publications by title
export async function searchPublications({title=null, start=0, size=10}) {
    const constraints = [];
    if (title) {
        const constraint = this.pathquery.intermineConstraint('Publication.title', 'CONTAINS', title);
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
