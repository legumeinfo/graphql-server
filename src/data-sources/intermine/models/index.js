const { response2graphqlObjects } = require('../intermine.pathquery.js');

const authorModels = require('./author.js');
const expressionSampleModels = require('./expression-sample.js');
const expressionSourceModels = require('./expression-source.js');
const geneModels = require('./gene.js');
const geneFamilyAssignmentModels = require('./gene-family-assignment.js');
const geneFamilyModels = require('./gene-family.js');
const geneticMapModels = require('./genetic-map.js');
const gwasModels = require('./gwas.js');
const gwasResultModels = require('./gwas-result.js');
const linkageGroupModels = require('./linkage-group.js');
const ontologyModels = require('./ontology.js');
const ontologyTermModels = require('./ontology-term.js');
const organismModels = require('./organism.js');
const phylonodeModels = require('./phylonode.js');
const phylotreeModels = require('./phylotree.js');
const proteinDomainModels = require('./protein-domain.js');
const proteinModels = require('./protein.js');
const publicationModels = require('./publication.js');
const qtlModels = require('./qtl.js');
const qtlStudyModels = require('./qtl-study.js');
const strainModels = require('./strain.js');
const traitModels = require('./trait.js');

module.exports = {

    ...authorModels,
    ...expressionSampleModels,
    ...expressionSourceModels,
    ...geneModels,
    ...geneFamilyAssignmentModels,
    ...geneFamilyModels,
    ...geneticMapModels,
    ...gwasModels,
    ...gwasResultModels,
    ...linkageGroupModels,
    ...ontologyModels,
    ...ontologyTermModels,
    ...organismModels,
    ...phylonodeModels,
    ...phylotreeModels,
    ...proteinModels,
    ...proteinDomainModels,
    ...publicationModels,
    ...qtlModels,
    ...qtlStudyModels,
    ...strainModels,
    ...traitModels,
    
};
