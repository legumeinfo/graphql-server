// path query search for Organism of a given taxonId, abbreviation, name, genus, and/or species
export async function searchOrganisms({taxonId=null, abbreviation=null, name=null, genus=null, species=null, start=0, size=10}) {
    const constraints = [];
    if (taxonId) {
        const constraint = this.pathquery.intermineConstraint('Organism.taxonId', '=', taxonId);
        constraints.push(constraint);
    }
    if (abbreviation) {
        const constraint = this.pathquery.intermineConstraint('Organism.abbreviation', '=', abbreviation);
        constraints.push(constraint);
    }
    if (name) {
        const constraint = this.pathquery.intermineConstraint('Organism.name', '=',  name);
        constraints.push(constraint);
    }
    if (genus) {
        const constraint = this.pathquery.intermineConstraint('Organism.genus', '=', genus);
        constraints.push(constraint);
    }
    if (species) {
        const constraint = this.pathquery.intermineConstraint('Organism.species', '=', species);
        constraints.push(constraint);
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
