// get an ordered, paginated list of traits
async function getTraits({description, start=0, size=10}={}) {
    const sortBy = 'Trait.name';
    const constraints = [];
    if (description) {
        const descriptionConstraint =
              this.pathquery.intermineConstraint('Trait.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineTraitAttributes,
        sortBy,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2traits(response));
}


module.exports = getTraits;
