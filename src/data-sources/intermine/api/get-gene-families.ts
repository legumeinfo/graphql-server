// get GeneFamilies for a ProteinDomain
export async function getGeneFamilies({proteinDomain=null, start=0, size=10}) {
    const constraints = [];
    if (proteinDomain) {
        const proteinDomainConstraint = this.pathquery.intermineConstraint('GeneFamily.proteinDomains.id', '=', proteinDomain.id);
        constraints.push(proteinDomainConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineGeneFamilyAttributes,
        this.models.intermineGeneFamilySort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2geneFamilies(response));
}
