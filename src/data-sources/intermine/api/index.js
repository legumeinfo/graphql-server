// -------------------
// get object(s) by ID
// -------------------

const getExpressionSample = require('./get-expression-sample.js');
const getExpressionSamples = require('./get-expression-samples.js');

const getExpressionSource = require('./get-expression-source.js');

const getGene = require('./get-gene.js');
const getGenes = require('./get-genes.js');

const getGeneFamily = require('./get-gene-family.js');
const getGeneFamilies = require('./get-gene-families.js');

const getGeneFamilyAssignment = require('./get-gene-family-assignment.js');
const getGeneFamilyAssignments = require('./get-gene-family-assignments.js');

const getGeneticMap = require('./get-genetic-map.js');

const getGWAS = require('./get-gwas.js');

const getGWASResult = require('./get-gwas-result.js');
const getGWASResults = require('./get-gwas-results.js');

const getLinkageGroup = require('./get-linkage-group.js');
const getLinkageGroups = require('./get-linkage-groups.js');

const getOntology = require('./get-ontology.js');

const getOntologyTerm = require('./get-ontology-term.js');
const getOntologyTerms = require('./get-ontology-terms.js');

const getOrganism = require('./get-organism.js');
const getOrganisms = require('./get-organisms.js');

const getPhylonode = require('./get-phylonode.js');
const getPhylonodes = require('./get-phylonodes.js');

const getPhylotree = require('./get-phylotree.js');
const getPhylotrees = require('./get-protein-domain.js');

const getProteinDomain = require('./get-protein-domain.js');
const getProteinDomains = require('./get-protein-domains.js');

const getProtein = require('./get-protein.js');

const getQTL = require('./get-qtl.js');
const getQTLs = require('./get-qtls.js');

const getQTLStudy = require('./get-qtl-study.js');

const getStrain = require('./get-strain.js');
const getStrains = require('./get-strains.js');

const getTrait = require('./get-trait.js');
const getTraits = require('./get-traits.js');

// ------------------------------------------
// search for objects by keyword or pathquery
// ------------------------------------------

const geneSearch = require('./gene-search.js');
const traitSearch = require('./trait-search.js');


module.exports = {

    getExpressionSample,
    getExpressionSamples,

    getExpressionSource,
    
    getGene,
    getGenes,

    getGeneFamily,
    getGeneFamilies,
 
    getGeneFamilyAssignment,
    getGeneFamilyAssignments,

    getGeneticMap,

    getGWAS,

    getGWASResult,
    getGWASResults,

    getLinkageGroup,
    getLinkageGroups,
    
    getOntology,

    getOntologyTerm,
    getOntologyTerms,

    getOrganism,
    getOrganisms,

    getPhylonode,
    getPhylonodes,

    getPhylotree,
    getPhylotrees,

    getProteinDomain,
    getProteinDomains,

    getProtein,

    getQTL,
    getQTLs,

    getQTLStudy,

    getStrain,
    getStrains,

    getTrait,
    getTraits,


    geneSearch,
    traitSearch,

};
