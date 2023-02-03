// get a DataSet by ID
export async function getDataSet(id) {
    const constraints = [this.pathquery.intermineConstraint('DataSet.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineDataSetAttributes,
        this.models.intermineDataSetSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2dataSets(response))
        .then((dataSets) => {
            if (!dataSets.length) {
                const msg = `DataSet with ID '${id}' not found`;
                this.inputError(msg);
            }
            return dataSets[0];
        });
}
