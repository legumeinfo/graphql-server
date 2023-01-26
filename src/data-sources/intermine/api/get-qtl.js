// get a QTL by ID
async function getQTL(id) {
    const constraints = [this.pathquery.intermineConstraint('QTL.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineQTLAttributes,
        this.models.intermineQTLSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2qtls(response))
        .then((qtls) => {
            if (!qtls.length) {
                const msg = `QTL with ID '${id}' not found`;
                this.inputError(msg);
            }
            return qtls[0];
        });
}


module.exports = getQTL;
