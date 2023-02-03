// get Genes associated with a Protein, GeneFamily, ProteinDomain
export async function getGenes({protein=null, geneFamily=null, proteinDomain=null, start=0, size=10}) {
    const constraints = [];
    if (protein) {
        const proteinConstraint = this.pathquery.intermineConstraint('Gene.proteins.id', '=', protein.id);
        constraints.push(proteinConstraint);
    }
    if (geneFamily) {
        const geneFamilyConstraint = this.pathquery.intermineConstraint('Gene.geneFamilyAssignments.geneFamily.id', '=', geneFamily.id);
        constraints.push(geneFamilyConstraint);
    }
    if (proteinDomain) {
        const proteinDomainConstraint = this.pathquery.intermineConstraint('Gene.proteinDomains.id', '=', proteinDomain.id);
        constraints.push(proteinDomainConstraint);
    }
    // if (strain) {
    //     const strainConstraint =
    //           this.pathquery.intermineConstraint('Gene.strain.name', '=', strain);
    //     constraints.push(strainConstraint);
    // }
    // if (description) {
    //     const descriptionConstraint =
    //           this.pathquery.intermineConstraint('Gene.description', 'CONTAINS', description);
    //     constraints.push(descriptionConstraint);
    // }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineGeneAttributes,
        this.models.intermineGeneSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2genes(response));
}
