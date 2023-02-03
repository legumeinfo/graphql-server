// get a LinkageGroup by ID
export async function getLinkageGroup(id) {
    const constraints = [this.pathquery.intermineConstraint('LinkageGroup.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineLinkageGroupAttributes,
        this.models.intermineLinkageGroupSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2linkageGroups(response))
        .then((linkageGroups) => {
            if (!linkageGroups.length) {
                const msg = `LinkageGroup with ID '${id}' not found`;
                this.inputError(msg);
            }
            return linkageGroups[0];
        });
}
