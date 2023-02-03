// get an MRNA by ID
export async function getMRNA(id) {
    const constraints = [this.pathquery.intermineConstraint('MRNA.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineMRNAAttributes,
        this.models.intermineMRNASort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2mRNAs(response))
        .then((mRNAs) => {
            if (!mRNAs.length) {
                const msg = `MRNA with ID '${id}' not found`;
                this.inputError(msg);
            }
            return mRNAs[0];
        });
}
