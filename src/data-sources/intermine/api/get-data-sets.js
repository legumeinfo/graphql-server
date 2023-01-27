// get DataSets for a BioEntity
async function getDataSets({bioEntity, start=0, size=10}={}) {
    const constraints = [];
    if (bioEntity) {
        const bioEntityConstraint = this.pathquery.intermineConstraint('DataSet.bioEntities.id', '=', bioEntity.id);
        constraints.push(bioEntityConstraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.intermineDataSetAttributes,
        this.models.intermineDataSetSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2dataSets(response));
}


module.exports = getDataSets;
