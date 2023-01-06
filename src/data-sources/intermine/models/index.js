const { response2graphqlObjects } = require('../intermine.pathquery.js');

const authorModels = require('./author.js');
const chromosomeModels = require('./chromosome.js');
const dataSetModels = require('./data-set.js');
const expressionSampleModels = require('./expression-sample.js');
const expressionSourceModels = require('./expression-source.js');
const geneModels = require('./gene.js');
const geneFamilyModels = require('./gene-family.js');
const geneFamilyAssignmentModels = require('./gene-family-assignment.js');
const geneFamilyTallyModels = require('./gene-family-tally.js');
const geneticMapModels = require('./genetic-map.js');
const geneticMarkerModels = require('./genetic-marker.js');
const gwasModels = require('./gwas.js');
const gwasResultModels = require('./gwas-result.js');
const linkageGroupModels = require('./linkage-group.js');
const linkageGroupPositionModels = require('./linkage-group-position.js');
const locationModels = require('./location.js');
const ontologyModels = require('./ontology.js');
const ontologyAnnotationModels = require('./ontology-annotation.js');
const ontologyTermModels = require('./ontology-term.js');
const organismModels = require('./organism.js');
const pathwayModels = require('./pathway.js');
const phylonodeModels = require('./phylonode.js');
const phylotreeModels = require('./phylotree.js');
const proteinDomainModels = require('./protein-domain.js');
const proteinModels = require('./protein.js');
const publicationModels = require('./publication.js');
const qtlModels = require('./qtl.js');
const qtlStudyModels = require('./qtl-study.js');
const syntenicRegionModels = require('./syntenic-region.js');
const syntenyBlockModels = require('./synteny-block.js');
const strainModels = require('./strain.js');
const traitModels = require('./trait.js');

module.exports = {

    ...authorModels,
    ...chromosomeModels,
    ...dataSetModels,
    ...expressionSampleModels,
    ...expressionSourceModels,
    ...geneModels,
    ...geneFamilyModels,
    ...geneFamilyAssignmentModels,
    ...geneFamilyTallyModels,
    ...geneticMapModels,
    ...geneticMarkerModels,
    ...gwasModels,
    ...gwasResultModels,
    ...linkageGroupModels,
    ...linkageGroupPositionModels,
    ...locationModels,
    ...ontologyModels,
    ...ontologyAnnotationModels,
    ...ontologyTermModels,
    ...organismModels,
    ...pathwayModels,
    ...phylonodeModels,
    ...phylotreeModels,
    ...proteinModels,
    ...proteinDomainModels,
    ...publicationModels,
    ...qtlModels,
    ...qtlStudyModels,
    ...strainModels,
    ...syntenicRegionModels,
    ...syntenyBlockModels,
    ...traitModels,
    
};
