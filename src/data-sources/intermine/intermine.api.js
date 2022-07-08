const { RESTDataSource } = require('apollo-datasource-rest');
const { UserInputError } = require('apollo-server');


// creates a Path Query constraint XML string
function intermineConstraint(path, op, value) {
  return `<constraint path='${path}' op='${op}' value='${value}'/>`;
}


// creates a Path Query XML string
function interminePathQuery(viewAttributes, sortBy, constraints=[]) {
  const view = viewAttributes.join(' ');
  const constraint = constraints.join('');
  return `<query model='genomic' view='${view}' sortOrder='${sortBy} ASC'>${constraint}</query>`;
}


// converts an InterMine result array into a GraphQL type
function result2graphqlObject(result, graphqlAttributes) {
  const entries = graphqlAttributes.map((e, i) => [e, result[i]]);
  //console.log(entries)
  return Object.fromEntries(entries);
}


// converts an Intermine response into an array of GraphQL types
function response2graphqlObjects(response, graphqlAttributes) {
  return consolidate(response.results.map((result) => result2graphqlObject(result, graphqlAttributes)));
}

//HACK:
// finds duplicates and merges 
function consolidate(possibly_duplicated_obj_list) {
    const lookup = new Map();
    for (const obj of possibly_duplicated_obj_list) {
        urobj = lookup.get(obj.id);
        if (urobj) {
            //HACK:
            if (obj.hasOwnProperty('proteinDomains')) {
                urobj.proteinDomains.push({name: obj.proteinDomains});
            }
        }
        else {
            if (obj.hasOwnProperty('proteinDomains')) {
                obj.proteinDomains = [{name : obj.proteinDomains}];
            }
            lookup.set(obj.id, obj);
        }
    }
    return Array.from(lookup.values());
}


// the attributes of an Organism in InterMine
const intermineOrganismAttributes = [
  'Organism.id',
  'Organism.name',
  'Organism.commonName',
  'Organism.description',
  'Organism.genus',
  'Organism.species',
];


// the attributes of an Organism in the GraphQL API
const graphqlOrganismAttributes = [
  'id',
  'name',
  'commonName',
  'description',
  'genus',
  'species',
];


// converts an Intermine response into an array of GraphQL Organism objects
function response2organisms(response) {
  return response2graphqlObjects(response, graphqlOrganismAttributes);
}

// the attributes of an Strain in InterMine
const intermineStrainAttributes = [
  'Strain.id',
  'Strain.name',
  'Strain.accession',
];


// the attributes of an Strain in the GraphQL API
const graphqlStrainAttributes = [
  'id',
  'name',
  'accession',
];


// converts an Intermine response into an array of GraphQL Strain objects
function response2strains(response) {
  return response2graphqlObjects(response, graphqlStrainAttributes);
}


// the attributes of a Gene in InterMine
const intermineGeneAttributes = [
  'Gene.id',
  'Gene.name',
  'Gene.description',
  'Gene.strain.id',
  'Gene.assemblyVersion',
  //'Gene.geneFamily.id',
  'Gene.proteinDomains.name',
  //'Gene.proteinDomains.accession',
];


// the attributes of a Gene in the GraphQL API
const graphqlGeneAttributes = [
  'id',
  'name',
  'description',
  'strainId',
  'genome',
  'proteinDomains',
];


// converts an Intermine response into an array of GraphQL Gene objects
function response2genes(response) {
  console.log(response);
  return response2graphqlObjects(response, graphqlGeneAttributes);
}

// the attributes of a ProteinDomain in InterMine
const intermineProteinDomainAttributes = [
  'ProteinDomain.id',
  'ProteinDomain.identifier',
  'ProteinDomain.name',
  'ProteinDomain.description',
];

// the attributes of a ProteinDomain in the GraphQL API
const graphqlProteinDomainAttributes = [
  'id',
  'accession',
  'name',
  'description',
];


// converts an Intermine response into an array of GraphQL ProteinDomain objects
function response2proteindomains(response) {
  return response2graphqlObjects(response, graphqlProteinDomainAttributes);
}


// the attributes of a Gene Family in InterMine
const intermineGeneFamilyAttributes = [
  'GeneFamily.id',
  'GeneFamily.identifier',
  'GeneFamily.description',
];


// the attributes of a Gene Family in the GraphQL API
const graphqlGeneFamilyAttributes = [
  'id',
  'name',
  'description',
];


// converts an Intermine response into an array of GraphQL Gene Family objects
function response2geneFamilies(response) {
  return response2graphqlObjects(response, graphqlGeneFamilyAttributes);
}


class IntermineAPI extends RESTDataSource {

  constructor(baseURL) {
      super();
      this.baseURL = baseURL;
  }

  // get an ordered, paginated list of organisms
  async getOrganisms({genus, start=0, size=10}={}) {
    const sortBy = 'Organism.name';
    const constraints = [];
    if (genus) {
      const genusConstraint = intermineConstraint('Organism.genus', '=', genus)
      constraints.push(genusConstraint);
    }
    const query = interminePathQuery(intermineOrganismAttributes, sortBy, constraints);
    const params = {query, start, size, format: 'json'};
    return this.get('query/results', params).then(response2organisms);
  }

  // get an organism by ID
  async getOrganism(id) {
      const sortBy = 'Organism.name';
      const constraints = [intermineConstraint('Organism.id', '=', id)];
      const query = interminePathQuery(intermineOrganismAttributes, sortBy, constraints);
      const params = {query, format: 'json'};
      return this.get('query/results', params)
        .then(response2organisms)
        .then((organisms) => {
          if (!organisms.length) {
            const msg = `Organism with ID '${id}' not found`;
            throw new UserInputError(msg);
          }
          return organisms[0];
        });
  }

  // get an ordered, paginated list of strains
  async getStrains({organism, start=0, size=10}={}) {
    const sortBy = 'Strain.name';
    const constraints = [];
    if (organism) {
      const organismConstraint = intermineConstraint('Strain.organism.id', '=', organism)
      constraints.push(organismConstraint);
    }
    const query = interminePathQuery(intermineStrainAttributes, sortBy, constraints);
    const params = {query, start, size, format: 'json'};
    return this.get('query/results', params).then(response2strains);
  }

  // get a strain by ID
  async getStrain(id) {
      const sortBy = 'Strain.name';
      const constraints = [intermineConstraint('Strain.id', '=', id)];
      const query = interminePathQuery(intermineStrainAttributes, sortBy, constraints);
      //console.log(query);
      const params = {query, format: 'json'};
      return this.get('query/results', params)
        .then(response2strains)
        .then((strains) => {
          if (!strains.length) {
            const msg = `Strain with ID '${id}' not found`;
            throw new UserInputError(msg);
          }
          return strains[0];
        });
  }

  // get an ordered, paginated list of ProteinDomains
  async getProteinDomains({gene, start=0, size=10}={}) {
    const sortBy = 'ProteinDomain.name';
    const constraints = [];
    //if (gene) {
      //const geneConstraint = intermineConstraint('Strain.organism.id', '=', gene)
      //constraints.push(geneConstraint);
    //}
    const query = interminePathQuery(intermineProteinDomainAttributes, sortBy, constraints);
    const params = {query, start, size, format: 'json'};
    return this.get('query/results', params).then(response2proteindomains);
  }


  // get an ordered, paginated list of genes
  async getGenes({strain, family, description, start=0, size=10}={}) {
    const sortBy = 'Gene.name';
    const constraints = [];
    if (strain) {
      const strainConstraint = intermineConstraint('Gene.strain.name', '=', strain)
      constraints.push(strainConstraint);
    }
    if (family) {
      const familyConstraint = intermineConstraint('Gene.geneFamily.identifier', '=', family)
      constraints.push(familyConstraint);
    }
    if (description) {
      const descriptionConstraint = intermineConstraint('Gene.description', 'CONTAINS', description)
      constraints.push(descriptionConstraint);
    }
    const query = interminePathQuery(intermineGeneAttributes, sortBy, constraints);
    const params = {query, start, size, format: 'json'};
    return this.get('query/results', params).then(response2genes);
  }

  // get a gene by ID
  async getGene(id) {
      const sortBy = 'Gene.name';
      const constraints = [intermineConstraint('Gene.identifier', '=', id)];
      const query = interminePathQuery(intermineGeneAttributes, sortBy, constraints);
      const params = {query, format: 'json'};
      return this.get('query/results', params)
        .then(response2genes)
        .then((genes) => {
          if (!genes.length) {
            const msg = `Gene with ID '${id}' not found`;
            throw new UserInputError(msg);
          }
          return genes[0];
        });
  }

  // get an ordered, paginated list of gene families
  async getGeneFamilies(start=0, size=10) {
    const sortBy = 'GeneFamily.identifier';
    const query = interminePathQuery(intermineGeneFamilyAttributes, sortBy);
    const params = {query, start, size, format: 'json'};
    return this.get('query/results', params).then(response2geneFamilies);
  }

  // get a gene family by ID
  async getGeneFamily(id) {
      const sortBy = 'GeneFamily.identifier';
      const constraints = [intermineConstraint('GeneFamily.id', '=', id)];
      const query = interminePathQuery(intermineGeneFamilyAttributes, sortBy, constraints);
      const params = {query, format: 'json'};
      return this.get('query/results', params)
        .then(response2geneFamilies)
        .then((geneFamilies) => {
          if (!geneFamilies.length) {
            const msg = `Gene Family with ID '${id}' not found`;
            throw new UserInputError(msg);
          }
          return geneFamilies[0];
        });
  }
    
}

module.exports = { IntermineAPI };
