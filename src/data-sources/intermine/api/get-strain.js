// get a Strain by identifier
async function getStrain(identifier) {
    const constraints = [this.pathquery.intermineConstraint('Strain.identifier', '=', identifier)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineStrainAttributes,
        this.models.intermineStrainSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2strains(response))
        .then((strains) => {
            if (!strains.length) {
                const msg = `Strain with identifier '${identifier}' not found`;
                this.inputError(msg);
            }
            return strains[0];
        });
}


module.exports = getStrain;
