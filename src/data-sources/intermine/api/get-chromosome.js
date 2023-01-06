// get a Chromosome by ID
async function getChromosome(id) {
    const constraints = [this.pathquery.intermineConstraint('Chromosome.id', '=', id)];
    const query = this.pathquery.interminePathQuery(
        this.models.intermineChromosomeAttributes,
        this.models.intermineChromosomeSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response) => this.models.response2chromosomes(response))
        .then((chromosomes) => {
            if (!chromosomes.length) {
                const msg = `Chromosome with ID '${id}' not found`;
                this.inputError(msg);
            }
            return chromosomes[0];
        });
}


module.exports = getChromosome;
