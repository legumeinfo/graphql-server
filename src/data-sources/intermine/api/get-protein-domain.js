// get a ProteinDomain by ID
async function getProteinDomain(id) {
    const constraints = [this.pathquery.intermineConstraint('ProteinDomain.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineProteinDomainAttributes,
        this.models.intermineProteinDomainSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2proteinDomains(response))
        .then((proteinDomains) => {
            if (!proteinDomains.length) {
                const msg = `ProteinDomain with ID '${id}' not found`;
                this.inputError(msg);
            }
            return proteinDomains[0];
        });
}


module.exports = getProteinDomain;
