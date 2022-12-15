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

    // get an organism by ID
    async getOrganism(id) {
        const constraints = [pathquery.intermineConstraint('Organism.id', '=', id)];
        const query =
              pathquery.interminePathQuery(
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

    // get an ordered, paginated list of organisms
    async getOrganisms({genus, start=0, size=10}={}) {
        const constraints = [];
        if (genus) {
            const genusConstraint = pathquery.intermineConstraint('Organism.genus', '=', genus);
            constraints.push(genusConstraint);
        }
        const query =
              pathquery.interminePathQuery(
                  models.intermineOrganismAttributes,
                  models.intermineOrganismSort,
                  constraints,
              );
        const options = {start, size};
        return this.pathQuery(query, options).then(models.response2organisms);
    }

    // get a strain by ID
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

    // get strains for a given organism ID
    async getStrains(organismId) {
        const constraints = [pathquery.intermineConstraint('Strain.organism.id', '=', organismId)];
        const query = pathquery.interminePathQuery(
            models.intermineStrainAttributes,
            models.intermineStrainSort,
            constraints,
        );
        return this.pathQuery(query).then(models.response2strains);
    }

    // get an ordered, paginated list of ProteinDomains for a given gene ID
    async getProteinDomains({geneId, start=0, size=10}={}) {
        const constraints = [pathquery.intermineConstraint('Gene.id', '=', geneId)];
        const query = pathquery.interminePathQuery(
            models.intermineGeneProteinDomainAttributes,
            models.intermineGeneProteinDomainSort,
            constraints,
        );
        const options = {start, size};
        return this.pathQuery(query, options).then(models.response2proteindomains);
    }


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

    // get an ordered, paginated list of genes
    async getGenes({strain, family, description, start=0, size=10}={}) {
        const constraints = [];
        if (strain) {
            const strainConstraint =
                  pathquery.intermineConstraint('Gene.strain.name', '=', strain);
            constraints.push(strainConstraint);
        }
        if (family) {
            const familyConstraint =
                  pathquery.intermineConstraint('Gene.geneFamily.identifier', '=', family);
            constraints.push(familyConstraint);
        }
        if (description) {
            const descriptionConstraint =
                  pathquery.intermineConstraint('Gene.description', 'CONTAINS', description);
            constraints.push(descriptionConstraint);
        }
        const query =
              pathquery.interminePathQuery(
                  models.intermineGeneAttributes,
                  models.intermineGeneSort,
                  constraints,
              );
        const options = {start, size};
        return this.pathQuery(query, options).then(models.response2genes);
    }

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

    // get an ordered, paginated list of gene families
    async getGeneFamilies({start=0, size=10}={}) {
        const sortBy = 'GeneFamily.identifier';
        const query =
              pathquery.interminePathQuery(
                  models.intermineGeneFamilyAttributes,
                  sortBy,
              );
        const options = {start, size};
        return this.pathQuery(query, options).then(models.response2geneFamilies);
    }

    // get gene family assignments for a given gene
    async getGeneFamilyAssignments(geneId) {
        const sortBy = 'Gene.GeneFamilyAssignments.id';
        const constraints = [pathquery.intermineConstraint('Gene.id', '=', geneId)];
        const query =
              pathquery.interminePathQuery(
                  models.intermineGeneFamilyAssignmentAttributes,
              );
        return this.pathQuery(query).then(models.response2geneFamilyAssignments);
    }
    
    // get a gene family by ID
    async getGeneFamily(id) {
        const sortBy = 'GeneFamily.identifier';
        const constraints = [pathquery.intermineConstraint('GeneFamily.id', '=', id)];
        const query =
              pathquery.interminePathQuery(
                  models.intermineGeneFamilyAttributes,
                  sortBy,
                  constraints,
              );
        return this.pathQuery(query)
            .then(models.response2geneFamilies)
            .then((geneFamilies) => {
                if (!geneFamilies.length) {
                    const msg = `Gene Family with ID '${id}' not found`;
                    throw new UserInputError(msg);
                }
                return geneFamilies[0];
            });
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
        const query =
              pathquery.interminePathQuery(
                  models.intermineTraitAttributes,
                  sortBy,
                  constraints,
              );
        const options = {start, size};
        return this.pathQuery(query, options).then(models.response2traits);
    }

    // get a trait by ID
    async getTrait(id) {
        const sortBy = 'Trait.name';
        const constraints = [pathquery.intermineConstraint('Trait.id', '=', id)];
        const query =
              pathquery.interminePathQuery(
                  models.intermineTraitAttributes,
                  sortBy,
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
