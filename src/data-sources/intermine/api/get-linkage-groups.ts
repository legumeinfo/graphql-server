// get LinkageGroups for a GeneticMap
export async function getLinkageGroups({geneticMap=null, start=0, size=10}) {
    const constraints = [];
    if (geneticMap) {
        const geneticMapConstraint = this.pathquery.intermineConstraint('LinkageGroup.geneticMap.id', '=', geneticMap.id);
        constraints.push(geneticMapConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineLinkageGroupAttributes,
        this.models.intermineLinkageGroupSort,
        constraints,
    );
    return this.pathQuery(query).then((response) => this.models.response2linkageGroups(response));
}
