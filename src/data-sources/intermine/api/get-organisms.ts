// get Organisms belonging to a genus, species
export async function getOrganisms({genus=null, species=null, start=0, size=10}) {
    const constraints = [];
    if (genus) {
        const genusConstraint = this.pathquery.intermineConstraint('Organism.genus', '=', genus);
        constraints.push(genusConstraint);
    }
    if (species) {
        const speciesConstraint = this.pathquery.intermineConstraint('Organism.species', '=', species);
        constraints.push(speciesConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineOrganismAttributes,
        this.models.intermineOrganismSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2organisms(response));
}
