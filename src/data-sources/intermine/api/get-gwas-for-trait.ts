// get the GWAS for a Trait
export async function getGWASForTrait(trait) {
    const constraints = [this.pathquery.intermineConstraint('GWAS.results.trait.id', '=', trait.id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineGWASAttributes,
        this.models.intermineGWASSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2gwas(response))
        .then((gwas) => {
            if (gwas.length) {
                return gwas[0];
            } else {
                return null;
            }
        });
}
