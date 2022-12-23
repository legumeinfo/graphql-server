// get Strains associated with an Organism
async function getStrains({organism, start=0, size=10}={}) {
    const constraints = [];
    if (organism) {
        const organismConstraint = this.pathquery.intermineConstraint('Strain.organism.id', '=', organism.id);
        constraints.push(organismConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineStrainAttributes,
        this.models.intermineStrainSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2strains(response));
}


module.exports = getStrains;
