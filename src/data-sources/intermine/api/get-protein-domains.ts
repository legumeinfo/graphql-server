// get ProteinDomains for a Gene, GeneFamily
export async function getProteinDomains({gene=null, geneFamily=null, start=0, size=10}) {
    const constraints = [];
    if (gene) {
        const geneConstraint = this.pathquery.intermineConstraint('ProteinDomain.genes.id', '=', gene.id);
        constraints.push(geneConstraint);
    }
    if (geneFamily) {
        const geneFamilyConstraint = this.pathquery.intermineConstraint('ProteinDomain.geneFamilies.id', '=', geneFamily.id);
        constraints.push(geneFamilyConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineProteinDomainAttributes,
        this.models.intermineProteinDomainSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2proteinDomains(response));
}
