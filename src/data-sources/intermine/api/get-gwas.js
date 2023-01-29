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

module.exports = getGWAS;
