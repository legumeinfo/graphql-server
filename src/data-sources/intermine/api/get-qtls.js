// get QTLs for a LinkageGroup, Trait
async function getQTLs({linkageGroup, trait, start=0, size=10}={}) {
    const constraints = [];
    if (linkageGroup) {
        const linkageGroupConstraint = this.pathquery.intermineConstraint('QTL.linkageGroup.id', '=', linkageGroup.id);
        constraints.push(linkageGroupConstraint);
    }
    if (trait) {
        const traitConstraint = this.pathquery.intermineConstraint('QTL.trait.id', '=', trait.id);
        constraints.push(traitConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineQTLAttributes,
        this.models.intermineQTLSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2qtls(response));
}


module.exports = getQTLs;
