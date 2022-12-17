// dependencies
const { RESTDataSource } = require('apollo-datasource-rest');
const { UserInputError } = require('apollo-server');
// local
const models = require('./intermine.models.js');
const pathquery = require('./intermine.pathquery.js');


class IntermineAPI extends RESTDataSource {

    constructor(baseURL) {
        super();
        this.baseURL = baseURL;
    }

    async pathQuery(query, options={}) {
        const params = {
            query,
            ...options,
            format: 'json',
        };
        return this.get('query/results', params);
    }

    async keywordSearch(q, options={}) {
        const params = {
            q,
            ...options,
            format: 'json',
        };
        return this.get('search', params);
    }

    ////////////////////
    // OBJECT GETTERS //
    ////////////////////

    // get a gene by ID
    async getGene(id) {
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

    // get a GeneFamilyAssignment by ID
    async getGeneFamilyAssignment(id) {
        const constraints = [pathquery.intermineConstraint('GeneFamilyAssignment.id', '=', id)];
        const query = pathquery.interminePathQuery(
            models.intermineGeneFamilyAssignmentAttributes,
            models.intermineGeneFamilyAssignmentSort,
            constraints,
        );
        return this.pathQuery(query)
            .then(models.response2geneFamilyAssignments)
            .then((geneFamilyAssignments) => {
                if (!geneFamilyAssignments.length) {
                    const msg = `GeneFamilyAssignment with ID '${id}' not found`;
                    throw new UserInputError(msg);
                }
                return geneFamilyAssignments[0];
            });
    }

    // get a GeneFamily by ID
    async getGeneFamily(id) {
        const constraints = [pathquery.intermineConstraint('GeneFamily.id', '=', id)];
        const query = pathquery.interminePathQuery(
            models.intermineGeneFamilyAttributes,
            models.intermineGeneFamilySort,
            constraints,
        );
        return this.pathQuery(query)
            .then(models.response2geneFamilies)
            .then((geneFamilies) => {
                if (!geneFamilies.length) {
                    const msg = `GeneFamily with ID '${id}' not found`;
                    throw new UserInputError(msg);
                }
                return geneFamilies[0];
            });
    }

    // get a GWAS by ID
    async getGWAS(id) {
        const constraints = [pathquery.intermineConstraint('GWAS.id', '=', id)];
        const query = pathquery.interminePathQuery(
            models.intermineGWASAttributes,
            models.intermineGWASSort,
            constraints,
        );
        return this.pathQuery(query)
            .then(models.response2gwas)
            .then((gwas) => {
                if (!gwas.length) {
                    const msg = `GWAS with ID '${id}' not found`;
                    throw new UserInputError(msg);
                }
                return gwas[0];
            });
    }

    // get a GWASResult by ID
    async getGWASResult(id) {
        const constraints = [pathquery.intermineConstraint('GWASResult.id', '=', id)];
        const query = pathquery.interminePathQuery(
            models.intermineGWASResultAttributes,
            models.intermineGWASResultSort,
            constraints,
        );
        return this.pathQuery(query)
            .then(models.response2gwasResults)
            .then((gwasResults) => {
                if (!gwasResults.length) {
                    const msg = `GWASResult with ID '${id}' not found`;
                    throw new UserInputError(msg);
                }
                return gwasResults[0];
            });
    }

    // get an Ontology by ID
    async getOntology(id) {
        const constraints = [pathquery.intermineConstraint('Ontology.id', '=', id)];
        const query = pathquery.interminePathQuery(
            models.intermineOntologyAttributes,
            models.intermineOntologySort,
            constraints,
        );
        return this.pathQuery(query)
            .then(models.response2ontologies)
            .then((ontologies) => {
                if (!ontologies.length) {
                    const msg = `Ontology with ID '${id}' not found`;
                    throw new UserInputError(msg);
                }
                return ontologies[0];
            });
    }

    // get an OntologyTerm by ID
    async getOntologyTerm(id) {
        const constraints = [pathquery.intermineConstraint('OntologyTerm.id', '=', id)];
        const query = pathquery.interminePathQuery(
            models.intermineOntologyTermAttributes,
            models.intermineOntologyTermSort,
            constraints,
        );
        return this.pathQuery(query)
            .then(models.response2ontologyTerms)
            .then((ontologyTerms) => {
                if (!ontologyTerms.length) {
                    const msg = `OntologyTerm with ID '${id}' not found`;
                    throw new UserInputError(msg);
                }
                return ontologyTerms[0];
            });
    }

    // get an Organism by ID
    async getOrganism(id) {
        const constraints = [pathquery.intermineConstraint('Organism.id', '=', id)];
        const query = pathquery.interminePathQuery(
            models.intermineOrganismAttributes,
            models.intermineOrganismSort,
            constraints,
        );
        return this.pathQuery(query)
            .then(models.response2organisms)
            .then((organisms) => {
                if (!organisms.length) {
                    const msg = `Organism with ID '${id}' not found`;
                    throw new UserInputError(msg);
                }
                return organisms[0];
            });
    }

    // get a Phylotree by ID
    async getPhylotree(id) {
        const constraints = [pathquery.intermineConstraint('Phylotree.id', '=', id)];
        const query = pathquery.interminePathQuery(
            models.interminePhylotreeAttributes,
            models.interminePhylotreeSort,
            constraints,
        );
        return this.pathQuery(query)
            .then(models.response2phylotrees)
            .then((phylotrees) => {
                if (!phylotrees.length) {
                    const msg = `Phylotree with ID '${id}' not found`;
                    throw new UserInputError(msg);
                }
                return phylotrees[0];
            });
    }

    // get a Phylonode by ID
    async getPhylonode(id) {
        const constraints = [pathquery.intermineConstraint('Phylonode.id', '=', id)];
        const query = pathquery.interminePathQuery(
            models.interminePhylonodeAttributes,
            models.interminePhylonodeSort,
            constraints,
        );
        return this.pathQuery(query)
            .then(models.response2phylonodes)
            .then((phylonodes) => {
                if (!phylonodes.length) {
                    const msg = `Phylonode with ID '${id}' not found`;
                    throw new UserInputError(msg);
                }
                return phylonodes[0];
            });
    }

    // get a Protein by ID
    async getProtein(id) {
        const constraints = [pathquery.intermineConstraint('Protein.id', '=', id)];
        const query = pathquery.interminePathQuery(
            models.intermineProteinAttributes,
            models.intermineProteinSort,
            constraints,
        );
        return this.pathQuery(query)
            .then(models.response2proteins)
            .then((proteins) => {
                if (!proteins.length) {
                    const msg = `Protein with ID '${id}' not found`;
                    throw new UserInputError(msg);
                }
                return proteins[0];
            });
    }

    // get a ProteinDomain by ID
    async getProteinDomain(id) {
        const constraints = [pathquery.intermineConstraint('ProteinDomain.id', '=', id)];
        const query = pathquery.interminePathQuery(
            models.intermineProteinDomainAttributes,
            models.intermineProteinDomainSort,
            constraints,
        );
        return this.pathQuery(query)
            .then(models.response2proteinDomains)
            .then((proteinDomains) => {
                if (!proteinDomains.length) {
                    const msg = `ProteinDomain with ID '${id}' not found`;
                    throw new UserInputError(msg);
                }
                return proteinDomains[0];
            });
    }

    // get a QTL by ID
    async getQTL(id) {
        const constraints = [pathquery.intermineConstraint('QTL.id', '=', id)];
        const query = pathquery.interminePathQuery(
            models.intermineQTLAttributes,
            models.intermineQTLSort,
            constraints,
        );
        return this.pathQuery(query)
            .then(models.response2qtls)
            .then((qtls) => {
                if (!qtls.length) {
                    const msg = `QTL with ID '${id}' not found`;
                    throw new UserInputError(msg);
                }
                return qtls[0];
            });
    }

    // get a Strain by ID
    async getStrain(id) {
        const constraints = [pathquery.intermineConstraint('Strain.id', '=', id)];
        const query = pathquery.interminePathQuery(
            models.intermineStrainAttributes,
            models.intermineStrainSort,
            constraints,
        );
        return this.pathQuery(query)
            .then(models.response2strains)
            .then((strains) => {
                if (!strains.length) {
                    const msg = `Strain with ID '${id}' not found`;
                    throw new UserInputError(msg);
                }
                return strains[0];
            });
    }

    // get a Trait by ID
    async getTrait(id) {
        const constraints = [pathquery.intermineConstraint('Trait.id', '=', id)];
        const query = pathquery.interminePathQuery(
            models.intermineTraitAttributes,
            models.intermineTraitSort,
            constraints,
        );
        return this.pathQuery(query)
            .then(models.response2traits)
            .then((traits) => {
                if (!traits.length) {
                    const msg = `Trait with ID '${id}' not found`;
                    throw new UserInputError(msg);
                }
                return traits[0];
            });
    }
    
    ////////////////////////
    // COLLECTION GETTERS //
    ////////////////////////

    // get Genes associated with a Protein, GeneFamily, ProteinDomain
    async getGenes({protein, geneFamily, proteinDomain, start=0, size=10}={}) {
        const constraints = [];
        if (protein) {
            const proteinConstraint = pathquery.intermineConstraint('Gene.proteins.id', '=', protein.id);
            constraints.push(proteinConstraint);
        }
        if (geneFamily) {
            const geneFamilyConstraint = pathquery.intermineConstraint('Gene.geneFamilyAssignments.geneFamily.id', '=', geneFamily.id);
            constraints.push(geneFamilyConstraint);
        }
        if (proteinDomain) {
            const proteinDomainConstraint = pathquery.intermineConstraint('Gene.proteinDomains.id', '=', proteinDomain.id);
            constraints.push(proteinDomainConstraint);
        }
        // if (strain) {
        //     const strainConstraint =
        //           pathquery.intermineConstraint('Gene.strain.name', '=', strain);
        //     constraints.push(strainConstraint);
        // }
        // if (description) {
        //     const descriptionConstraint =
        //           pathquery.intermineConstraint('Gene.description', 'CONTAINS', description);
        //     constraints.push(descriptionConstraint);
        // }
        const query = pathquery.interminePathQuery(
            models.intermineGeneAttributes,
            models.intermineGeneSort,
            constraints,
        );
        const options = {start, size};
        return this.pathQuery(query, options).then(models.response2genes);
    }

    // get GeneFamilyAssignments for a Gene, Protein
    async getGeneFamilyAssignments({gene, protein, start=0, size=10}={}) {
        const constraints = [];
        if (gene) {
            const geneConstraint = pathquery.intermineConstraint('Gene.id', '=', gene.id);
            constraints.push(geneConstraint);
            const query = pathquery.interminePathQuery(
                models.intermineGeneGeneFamilyAssignmentsAttributes,
                models.intermineGeneGeneFamilyAssignmentsSort,
                constraints,
            );
            return this.pathQuery(query).then(models.response2geneFamilyAssignments);
        } else if (protein) {
            const proteinConstraint = pathquery.intermineConstraint('Protein.id', '=', protein.id);
            constraints.push(proteinConstraint);
            const query = pathquery.interminePathQuery(
                models.intermineProteinGeneFamilyAssignmentsAttributes,
                models.intermineProteinGeneFamilyAssignmentsSort,
                constraints,
            );
            return this.pathQuery(query).then(models.response2geneFamilyAssignments);
        }
    }

    // get GWASResults for a GWAS, Trait
    async getGWASResults({gwas, trait, start=0, size=10}={}) {
        const constraints = [];
        if (gwas) {
            const gwasConstraint = pathquery.intermineConstraint('GWASResult.gwas.id', '=', gwas.id);
            constraints.push(gwasConstraint);
        }
        if (trait) {
            const traitConstraint = pathquery.intermineConstraint('GWASResult.trait.id', '=', trait.id);
            constraints.push(traitConstraint);
        }
        const query = pathquery.interminePathQuery(
            models.intermineGWASResultAttributes,
            models.intermineGWASResultSort,
            constraints,
        );
        return this.pathQuery(query).then(models.response2gwasResults);
    }
    
    // get OntologyTerms for a Trait
    async getOntologyTerms({trait, start=0, size=10}={}) {
        const constraints = [];
        if (trait) {
            const traitConstraint = pathquery.intermineConstraint('Trait.id', '=', trait.id);
            constraints.push(traitConstraint);
            const query = pathquery.interminePathQuery(
                models.intermineTraitOntologyTermsAttributes,
                models.intermineTraitOntologyTermsSort,
                constraints,
            );
            return this.pathQuery(query).then(models.response2ontologyTerms);
        }
    }

    // get Organisms belonging to a genus, species
    async getOrganisms({genus, species, start=0, size=10}={}) {
        const constraints = [];
        if (genus) {
            const genusConstraint = pathquery.intermineConstraint('Organism.genus', '=', genus);
            constraints.push(genusConstraint);
        }
        if (species) {
            const speciesConstraint = pathquery.intermineConstraint('Organism.species', '=', species);
            constraints.push(speciesConstraint);
        }
        const query = pathquery.interminePathQuery(
            models.intermineOrganismAttributes,
            models.intermineOrganismSort,
            constraints,
        );
        const options = {start, size};
        return this.pathQuery(query, options).then(models.response2organisms);
    }

    // get Phylonodes for a Phylotree or parent Phylonode
    async getPhylonodes({phylotree, parent, start=0, size=10}={}) {
        const constraints = [];
        if (phylotree) {
            const phylotreeConstraint = pathquery.intermineConstraint('Phylonode.tree.id', '=', phylotree.id);
            constraints.push(phylotreeConstraint);
        } else if (parent) {
            const parentConstraint = pathquery.intermineConstraint('Phylonode.parent.id', '=', parent.id);
            constraints.push(parentConstraint);
        }
        const query = pathquery.interminePathQuery(
            models.interminePhylonodeAttributes,
            models.interminePhylonodeSort,
            constraints,
        );
        const options = {start, size};
        return this.pathQuery(query, options).then(models.response2phylonodes);
    }

    // get ProteinDomains for a Gene, GeneFamily
    async getProteinDomains({gene, geneFamily, start=0, size=10}={}) {
        const constraints = [];
        if (gene) {
            const geneConstraint = pathquery.intermineConstraint('ProteinDomain.genes.id', '=', gene.id);
            constraints.push(geneConstraint);
        }
        if (geneFamily) {
            const geneFamilyConstraint = pathquery.intermineConstraint('ProteinDomain.geneFamilies.id', '=', geneFamily.id);
            constraints.push(geneFamilyConstraint);
        }
        const query = pathquery.interminePathQuery(
            models.intermineProteinDomainAttributes,
            models.intermineProteinDomainSort,
            constraints,
        );
        const options = {start, size};
        return this.pathQuery(query, options).then(models.response2proteinDomains);
    }
    
    // get GeneFamilies for a ProteinDomain
    async getGeneFamilies({proteinDomain, start=0, size=10}={}) {
        const constraints = [];
        if (proteinDomain) {
            const proteinDomainConstraint = pathquery.intermineConstraint('GeneFamily.proteinDomains.id', '=', proteinDomain.id);
            constraints.push(proteinDomainConstraint);
        }
        const query = pathquery.interminePathQuery(
            models.intermineGeneFamilyAttributes,
            models.intermineGeneFamilySort,
            constraints,
        );
        const options = {start, size};
        return this.pathQuery(query, options).then(models.response2geneFamilies);
    }
    
    // get Strains associated with an Organism
    async getStrains({organism, start=0, size=10}={}) {
        const constraints = [];
        if (organism) {
            const organismConstraint = pathquery.intermineConstraint('Strain.organism.id', '=', organism.id);
            constraints.push(organismConstraint);
        }
        const query = pathquery.interminePathQuery(
            models.intermineStrainAttributes,
            models.intermineStrainSort,
            constraints,
        );
        return this.pathQuery(query).then(models.response2strains);
    }

    // get an ordered, paginated list of traits
    async getTraits({description, start=0, size=10}={}) {
        const sortBy = 'Trait.name';
        const constraints = [];
        if (description) {
            const descriptionConstraint =
                  pathquery.intermineConstraint('Trait.description', 'CONTAINS', description);
            constraints.push(descriptionConstraint);
        }
        const query = pathquery.interminePathQuery(
            models.intermineTraitAttributes,
            sortBy,
            constraints,
        );
        const options = {start, size};
        return this.pathQuery(query, options).then(models.response2traits);
    }

    ////////////////////
    // KEYWORD SEARCH //
    ////////////////////
    
    // search for genes using a keyword
    async geneSearch(keyword, {start=0, size=10}={}) {
        const options = {
            start,
            size,
            facet_Category: 'Gene',
        };
        return this.keywordSearch(keyword, options)
            .then((response) => {
                return Promise.all(
                    response.results
                        .map((result) => result.id)
                        .map((id) => this.getGene(id))
                );
            });
    }

    // search for traits using a keyword
    async traitSearch(keyword, {start=0, size=10}={}) {
        const options = {
            start,
            size,
            facet_Category: 'Trait',
        };
        return this.keywordSearch(keyword, options)
            .then((response) => {
                return Promise.all(
                    response.results
                        .map((result) => result.id)
                        .map((id) => this.getTrait(id))
                );
            });
    }

}

module.exports = { IntermineAPI };
