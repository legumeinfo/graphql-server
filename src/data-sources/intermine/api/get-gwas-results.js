// get GWASResults for a GWAS, Trait
async function getGWASResults({gwas, trait, start=0, size=10}={}) {
    const constraints = [];
    if (gwas) {
        const gwasConstraint = this.pathquery.intermineConstraint('GWASResult.gwas.id', '=', gwas.id);
        constraints.push(gwasConstraint);
    }
    if (trait) {
        const traitConstraint = this.pathquery.intermineConstraint('GWASResult.trait.id', '=', trait.id);
        constraints.push(traitConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineGWASResultAttributes,
        this.models.intermineGWASResultSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2gwasResults(response));
}


module.exports = getGWASResults;
