// get GWASResults for a GWAS, Trait, GeneticMarker
//export async function getGWASResults({gwas=null, trait=null, geneticMarker=null, start=0, size=10}) {
export async function getGWASResults({gwas=null, trait=null, geneticMarker=null}) {
    const constraints = [];
    if (gwas) {
        const gwasConstraint = this.pathquery.intermineConstraint('GWASResult.gwas.id', '=', gwas.id);
        constraints.push(gwasConstraint);
    }
    if (trait) {
        const traitConstraint = this.pathquery.intermineConstraint('GWASResult.trait.id', '=', trait.id);
        constraints.push(traitConstraint);
    }
    if (geneticMarker) {
        const geneticMarkerConstraint = this.pathquery.intermineConstraint('GWASResult.markers.id', '=', geneticMarker.id);
        constraints.push(geneticMarkerConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineGWASResultAttributes,
        this.models.intermineGWASResultSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2gwasResults(response));
}
