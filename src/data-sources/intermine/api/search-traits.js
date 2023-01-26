// path query search for Traits by name
// NOTE: description is typically empty, as it describes the methods used to measure the trait.
async function searchTraits({name, start=0, size=10}={}) {
    const constraints = [];
    if (name) {
        const nameConstraint = this.pathquery.intermineConstraint('Trait.name', 'CONTAINS', name);
        constraints.push(nameConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineTraitAttributes,
        this.models.intermineTraitSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2traits(response));
}


module.exports = searchTraits;
