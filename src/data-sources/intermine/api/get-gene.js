// get a gene by ID
async function getGene(id) {
    const constraints = [pathquery.intermineConstraint('Gene.id', '=', id)];
    const query = pathquery.interminePathQuery(
        models.intermineGeneAttributes,
        models.intermineGeneSort,
        constraints,
    );
    return this.pathQuery(query)
        .then(models.response2genes)
        .then((genes) => {
            if (!genes.length) {
                const msg = `Gene with ID '${id}' not found`;
                throw new UserInputError(msg);
            }
            return genes[0];
        });
}


module.exports = getGene;
