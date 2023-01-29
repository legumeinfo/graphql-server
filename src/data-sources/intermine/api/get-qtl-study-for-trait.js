// get the QTLStudy for a Trait
async function getQTLStudyForTrait({trait}={}) {
    if (trait) {
        const constraints = [this.pathquery.intermineConstraint('QTLStudy.qtls.trait.id', '=', trait.id)];
        const query = this.pathquery.interminePathQuery(
            this.models.intermineQTLStudyAttributes,
            this.models.intermineQTLStudySort,
            constraints,
        );
        return this.pathQuery(query)
            .then((response) => this.models.response2qtlStudies(response))
            .then((qtlStudies) => {
                if (qtlStudies.length) {
                    return qtlStudies[0];
                } else {
                    return null;
                }
            });
    }
}

module.exports = getQTLStudyForTrait;
