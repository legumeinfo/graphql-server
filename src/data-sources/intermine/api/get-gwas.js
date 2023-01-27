// get a GWAS by ID
async function getGWAS(id) {
    const constraints = [this.pathquery.intermineConstraint('GWAS.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineGWASAttributes,
        this.models.intermineGWASSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2gwas(response))
        .then((gwas) => {
            if (!gwas.length) {
                const msg = `GWAS with ID '${id}' not found`;
                this.inputError(msg);
            }
            return gwas[0];
        });
}

// get the GWAS for a Trait
async function getGWAS({trait}={}) {
    if (trait) {
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
}

module.exports = getGWAS;
