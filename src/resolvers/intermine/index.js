const { mergeResolvers } = require('@graphql-tools/merge');

const expressionSampleFactory = require('./expression-sample.js');
const expressionSourceFactory = require('./expression-source.js');
const geneFamilyAssignmentFactory = require('./gene-family-assignment.js');
const geneFamilyFactory = require('./gene-family.js');
const geneFactory = require('./gene.js');
const geneticMapFactory = require('./genetic-map.js');
const gwasFactory = require('./gwas.js');
const gwasResultFactory = require('./gwas-result.js');
const linkageGroupFactory = require('./linkage-group.js');
const ontologyFactory = require('./ontology.js');
const ontologyTermFactory = require('./ontology-term.js');
const organismFactory = require('./organism.js');
const phylonodeFactory = require('./phylonode.js');
const phylotreeFactory = require('./phylotree.js');
const proteinDomainFactory = require('./protein-domain.js');
const proteinFactory = require('./protein.js');
const qtlFactory = require('./qtl.js');
const qtlStudyFactory = require('./qtl-study.js');
const strainFactory = require('./strain.js');
const traitFactory = require('./trait.js');

const mineWebPropertiesFactory = require('./mine-web-properties.js');

const factories = [
    expressionSampleFactory,
    expressionSourceFactory,
    geneFamilyAssignmentFactory,
    geneFamilyFactory,
    geneFactory,
    geneticMapFactory,
    gwasFactory,
    gwasResultFactory,
    linkageGroupFactory,
    ontologyFactory,
    ontologyTermFactory,
    organismFactory,
    phylonodeFactory,
    phylotreeFactory,
    proteinDomainFactory,
    proteinFactory,
    qtlFactory,
    qtlStudyFactory,
    strainFactory,
    traitFactory,

    mineWebPropertiesFactory,
];


// a factory function that generates resolvers for a specific InterMine
// data source.
const intermineResolverFactory = (sourceName) => {
    const sourceResolvers = factories.map((factory) => {
        return factory(sourceName);
    });
    return mergeResolvers(sourceResolvers);
};


module.exports = intermineResolverFactory;
