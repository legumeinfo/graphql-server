// path query search for QTLStudies by description
export async function searchQTLStudies({description=null, start=0, size=10}) {
    const constraints = [];
    if (description) {
        const descriptionConstraint = this.pathquery.intermineConstraint('QTLStudy.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineQTLStudyAttributes,
        this.models.intermineQTLStudySort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2qtlStudies(response));
}
