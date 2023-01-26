// get a GeneFamilyTally by ID
async function getGeneFamilyTally(id) {
    const constraints = [this.pathquery.intermineConstraint('GeneFamilyTally.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineGeneFamilyTallyAttributes,
        this.models.intermineGeneFamilyTallySort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2geneFamilyTallies(response))
        .then((geneFamilyTallies) => {
            if (!geneFamilyTallies.length) {
                const msg = `GeneFamilyTally with ID '${id}' not found`;
                this.inputError(msg);
            }
            return geneFamilyTallies[0];
        });
}

module.exports = getGeneFamilyTally;
