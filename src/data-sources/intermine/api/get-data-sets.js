// get DataSets for a BioEntity, GeneticMap, LinkageGroup, Location, OntologyAnnotation, Ontology, OntologyTerm, Pathway, Phylotree, SyntenyBlock
async function getDataSets({bioEntity, geneticMap, linkageGroup, location, ontologyAnnotation, ontology, ontologyTerm, pathway, phylotree, syntenyBlock, start=0, size=10}={}) {
    const options = {start, size};
    if (bioEntity) {
        const constraints = [this.pathquery.intermineConstraint('DataSet.bioEntities.id', '=', bioEntity.id)];
        const query = this.pathquery.interminePathQuery(
            this.models.intermineDataSetAttributes,
            this.models.intermineDataSetSort,
            constraints,
        );
        return this.pathQuery(query, options)
            .then((response) => this.models.response2dataSets(response));
    } else if (geneticMap) {
        const constraints = [this.pathquery.intermineConstraint('GeneticMap.id', '=', geneticMap.id)];
        const query = this.pathquery.interminePathQuery(
            this.models.intermineGeneticMapDataSetAttributes,
            this.models.intermineGeneticMapDataSetSort,
            constraints,
        );
        return this.pathQuery(query, options)
            .then((response) => this.models.response2dataSets(response));
    } else if (linkageGroup) {
        const constraints = [this.pathquery.intermineConstraint('LinkageGroup.id', '=', linkageGroup.id)];
        const query = this.pathquery.interminePathQuery(
            this.models.intermineLinkageGroupDataSetAttributes,
            this.models.intermineLinkageGroupDataSetSort,
            constraints,
        );
        return this.pathQuery(query, options)
            .then((response) => this.models.response2dataSets(response));
    } else if (location) {
        const constraints = [this.pathquery.intermineConstraint('Location.id', '=', location.id)];
        const query = this.pathquery.interminePathQuery(
            this.models.intermineLocationDataSetAttributes,
            this.models.intermineLocationDataSetSort,
            constraints,
        );
        return this.pathQuery(query, options)
            .then((response) => this.models.response2dataSets(response));
    } else if (ontologyAnnotation) {
        const constraints = [this.pathquery.intermineConstraint('OntologyAnnotation.id', '=', ontologyAnnotation.id)];
        const query = this.pathquery.interminePathQuery(
            this.models.intermineOntologyAnnotationDataSetAttributes,
            this.models.intermineOntologyAnnotationDataSetSort,
            constraints,
        );
        return this.pathQuery(query, options)
            .then((response) => this.models.response2dataSets(response));
    } else if (ontology) {
        const constraints = [this.pathquery.intermineConstraint('Ontology.id', '=', ontology.id)];
        const query = this.pathquery.interminePathQuery(
            this.models.intermineOntologyDataSetAttributes,
            this.models.intermineOntologyDataSetSort,
            constraints,
        );
        return this.pathQuery(query, options)
            .then((response) => this.models.response2dataSets(response));
    } else if (ontologyTerm) {
        const constraints = [this.pathquery.intermineConstraint('OntologyTerm.id', '=', ontologyTerm.id)];
        const query = this.pathquery.interminePathQuery(
            this.models.intermineOntologyTermDataSetAttributes,
            this.models.intermineOntologyTermDataSetSort,
            constraints,
        );
        return this.pathQuery(query, options)
            .then((response) => this.models.response2dataSets(response));
    } else if (pathway) {
        const constraints = [this.pathquery.intermineConstraint('Pathway.id', '=', pathway.id)];
        const query = this.pathquery.interminePathQuery(
            this.models.interminePathwayDataSetAttributes,
            this.models.interminePathwayDataSetSort,
            constraints,
        );
        return this.pathQuery(query, options)
            .then((response) => this.models.response2dataSets(response));
    } else if (phylotree) {
        const constraints = [this.pathquery.intermineConstraint('Phylotree.id', '=', phylotree.id)];
        const query = this.pathquery.interminePathQuery(
            this.models.interminePhylotreeDataSetAttributes,
            this.models.interminePhylotreeDataSetSort,
            constraints,
        );
        return this.pathQuery(query, options)
            .then((response) => this.models.response2dataSets(response));
    } else if (syntenyBlock) {
        const constraints = [this.pathquery.intermineConstraint('SyntenyBlock.id', '=', syntenyBlock.id)];
        const query = this.pathquery.interminePathQuery(
            this.models.intermineSyntenyBlockDataSetAttributes,
            this.models.intermineSyntenyBlockDataSetSort,
            constraints,
        );
        return this.pathQuery(query, options)
            .then((response) => this.models.response2dataSets(response));
    }
    
}


module.exports = getDataSets;
