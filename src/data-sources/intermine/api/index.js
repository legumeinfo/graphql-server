const getAuthor = require('./get-author.js');
const getAuthors = require('./get-authors.js');

const getChromosome = require('./get-chromosome.js');

const getDataSet = require('./get-data-set.js');

const getExpressionSample = require('./get-expression-sample.js');
const getExpressionSamples = require('./get-expression-samples.js');
const searchExpressionSamples = require('./search-expression-samples.js');

const getExpressionSource = require('./get-expression-source.js');
const searchExpressionSources = require('./search-expression-sources.js');

const getGene = require('./get-gene.js');
const getGenes = require('./get-genes.js');
const searchGenes = require('./search-genes.js');

const getGeneFamily = require('./get-gene-family.js');
const getGeneFamilies = require('./get-gene-families.js');
const searchGeneFamilies = require('./search-gene-families.js');

const getGeneFamilyAssignment = require('./get-gene-family-assignment.js');
const getGeneFamilyAssignments = require('./get-gene-family-assignments.js');

const getGeneFamilyTally = require('./get-gene-family-tally.js');
const getGeneFamilyTallies = require('./get-gene-family-tallies.js');

const getGeneticMap = require('./get-genetic-map.js');
const searchGeneticMaps = require('./search-genetic-maps.js');

const getGeneticMarker = require('./get-genetic-marker.js');
const getGeneticMarkers = require('./get-genetic-markers.js');

const getGWAS = require('./get-gwas.js');
const searchGWASes = require('./search-gwases.js');

const getGWASResult = require('./get-gwas-result.js');
const getGWASResults = require('./get-gwas-results.js');

const getLinkageGroup = require('./get-linkage-group.js');
const getLinkageGroups = require('./get-linkage-groups.js');

const getLinkageGroupPosition = require('./get-linkage-group-position.js');
const getLinkageGroupPositions = require('./get-linkage-group-positions.js');

const getLocation = require('./get-location.js');
const getLocations = require('./get-locations.js');

const getMRNA = require('./get-mrna.js');

const getOntology = require('./get-ontology.js');

const getOntologyAnnotation = require('./get-ontology-annotation.js');
const getOntologyAnnotations = require('./get-ontology-annotations.js');

const getOntologyTerm = require('./get-ontology-term.js');
const getOntologyTerms = require('./get-ontology-terms.js');
const getOntologyTermOntology = require('./get-ontology-term-ontology.js');
const searchOntologyTerms = require('./search-ontology-terms.js');

const getOrganism = require('./get-organism.js');
const getOrganisms = require('./get-organisms.js');
const searchOrganisms = require('./search-organisms.js');

const getPathway = require('./get-pathway.js');
const getPathways = require('./get-pathways.js');

const getPhylonode = require('./get-phylonode.js');
const getPhylonodes = require('./get-phylonodes.js');

const getPhylotree = require('./get-phylotree.js');
const getPhylotrees = require('./get-protein-domain.js');

const getProtein = require('./get-protein.js');
const searchProteins = require('./search-proteins.js');

const getProteinDomain = require('./get-protein-domain.js');
const getProteinDomains = require('./get-protein-domains.js');
const searchProteinDomains = require('./search-protein-domains.js');

const getPublication = require('./get-publication.js');
const getPublications = require('./get-publications.js');

const getQTL = require('./get-qtl.js');
const getQTLs = require('./get-qtls.js');
const searchQTLs = require('./search-qtls.js');

const getQTLStudy = require('./get-qtl-study.js');
const searchQTLStudies  = require('./search-qtl-studies.js');

const getSyntenicRegion = require('./get-syntenic-region.js');
const getSyntenicRegions = require('./get-syntenic-regions.js');

const getSyntenyBlock = require('./get-synteny-block.js');

const getStrain = require('./get-strain.js');
const getStrains = require('./get-strains.js');
const searchStrains = require('./search-strains.js');

const getTrait = require('./get-trait.js');
const searchTraits = require('./search-traits.js');


const getMineWebProperties = require('./get-mine-web-properties.js');

module.exports = {

    getAuthor,
    getAuthors,

    getChromosome,

    getDataSet,
    
    getExpressionSample,
    getExpressionSamples,
    searchExpressionSamples,

    getExpressionSource,
    searchExpressionSources,
    
    getGene,
    getGenes,
    searchGenes,

    getGeneFamily,
    getGeneFamilies,
    searchGeneFamilies,
 
    getGeneFamilyAssignment,
    getGeneFamilyAssignments,

    getGeneFamilyTally,
    getGeneFamilyTallies,

    getGeneticMap,
    searchGeneticMaps,

    getGeneticMarker,
    getGeneticMarkers,

    getGWAS,
    searchGWASes,
    
    getGWASResult,
    getGWASResults,

    getLinkageGroup,
    getLinkageGroups,

    getLinkageGroupPosition,
    getLinkageGroupPositions,

    getLocation,
    getLocations,
    
    getMRNA,
    
    getOntology,

    getOntologyAnnotation,
    getOntologyAnnotations,
    
    getOntologyTerm,
    getOntologyTerms,
    getOntologyTermOntology,
    searchOntologyTerms,
    
    getOrganism,
    getOrganisms,
    searchOrganisms,

    getPathway,
    getPathways,
    
    getPhylonode,
    getPhylonodes,

    getPhylotree,
    getPhylotrees,

    getProtein,
    searchProteins,
    
    getProteinDomain,
    getProteinDomains,
    searchProteinDomains,

    getPublication,
    getPublications,
    
    getQTL,
    getQTLs,
    searchQTLs,
    
    getQTLStudy,
    searchQTLStudies,

    getStrain,
    getStrains,
    searchStrains,

    getSyntenicRegion,
    getSyntenicRegions,

    getSyntenyBlock,
    
    getTrait,
    searchTraits,

    getMineWebProperties,

};
