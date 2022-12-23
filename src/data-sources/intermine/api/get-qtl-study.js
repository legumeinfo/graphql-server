// get a QTLStudy by ID
async function getQTLStudy(id) {
    const constraints = [this.pathquery.intermineConstraint('QTLStudy.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineQTLStudyAttributes,
        this.models.intermineQTLStudySort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2qtlStudies(response))
        .then((qtlStudies) => {
            if (!qtlStudies.length) {
                const msg = `QTLStudy with ID '${id}' not found`;
                this.inputError(msg);
            }
            return qtlStudies[0];
        });
}


module.exports = getQTLStudy;
