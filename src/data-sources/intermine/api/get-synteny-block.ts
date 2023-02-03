// get a SyntenyBlock by ID
export async function getSyntenyBlock(id) {
    const constraints = [this.pathquery.intermineConstraint('SyntenyBlock.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineSyntenyBlockAttributes,
        this.models.intermineSyntenyBlockSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2syntenyBlocks(response))
        .then((syntenyBlocks) => {
            if (!syntenyBlocks.length) {
                const msg = `SyntenyBlock with ID '${id}' not found`;
                this.inputError(msg);
            }
            return syntenyBlocks[0];
        });
}
