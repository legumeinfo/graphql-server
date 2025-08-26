import {faker} from '@faker-js/faker';

// Generate realistic biological test data
export const mockGeneData = {
  identifier: 'AT1G01010',
  symbol: 'NAC001',
  description: 'NAC domain containing protein 1',
  organism: 'Arabidopsis thaliana',
  assembly: 'TAIR10',
  chromosome: '1',
  start: 3631,
  end: 5899,
  strand: 1,
};

export const mockOrganismData = {
  taxonId: 3702,
  name: 'Arabidopsis thaliana',
  genus: 'Arabidopsis',
  species: 'thaliana',
  abbreviation: 'ARATH',
};

export const mockProteinData = {
  identifier: 'AT1G01010.1',
  name: 'NAC domain containing protein 1',
  length: 356,
  sequence: 'MTSSLL...', // Truncated for testing
};

export const mockStrainData = {
  identifier: 'Col-0',
  name: 'Columbia-0',
  description: 'Reference strain for Arabidopsis thaliana',
  origin: 'Laboratory collection',
};

export const mockPublicationData = {
  doi: '10.1038/nature01140',
  title: 'Analysis of the genome sequence of Arabidopsis thaliana',
  year: 2000,
};

export const mockLinkoutData = {
  identifier: 'AT1G01010_TAIR',
  url: 'https://www.arabidopsis.org/servlets/TairObject?type=locus&name=AT1G01010',
  text: 'View at TAIR',
  description: 'TAIR locus page for AT1G01010',
};

// Factory functions for generating test data
export function createMockGene(overrides: Partial<typeof mockGeneData> = {}) {
  return {
    ...mockGeneData,
    identifier: faker.string.alphanumeric(10).toUpperCase(),
    symbol: faker.string.alpha(6).toUpperCase(),
    description: faker.science.chemicalElement().name + ' protein',
    ...overrides,
  };
}

export function createMockOrganism(
  overrides: Partial<typeof mockOrganismData> = {},
) {
  return {
    ...mockOrganismData,
    taxonId: faker.number.int({min: 1000, max: 9999}),
    genus: faker.person.firstName(),
    species: faker.person.lastName().toLowerCase(),
    ...overrides,
  };
}

export function createMockProtein(
  overrides: Partial<typeof mockProteinData> = {},
) {
  return {
    ...mockProteinData,
    identifier: faker.string.alphanumeric(10) + '.1',
    length: faker.number.int({min: 100, max: 1000}),
    ...overrides,
  };
}

export function createMockStrain(
  overrides: Partial<typeof mockStrainData> = {},
) {
  return {
    ...mockStrainData,
    identifier: faker.string.alpha(5),
    name: faker.string.alpha(8),
    ...overrides,
  };
}

export function createMockPublication(
  overrides: Partial<typeof mockPublicationData> = {},
) {
  return {
    ...mockPublicationData,
    doi: '10.1038/' + faker.string.alphanumeric(10),
    title: faker.lorem.sentence(),
    year: faker.number.int({min: 1990, max: 2024}),
    ...overrides,
  };
}

// InterMine response format generators
export function createIntermineResponse(results: any[]) {
  return {results};
}

export function createIntermineCountResponse(count: number) {
  return {count};
}

// GraphQL query templates
export const GENE_QUERY = `
  query GetGene($identifier: ID!) {
    gene(identifier: $identifier) {
      results {
        identifier
        symbol
        description
        organism {
          name
          genus
          species
        }
      }
    }
  }
`;

export const ORGANISM_QUERY = `
  query GetOrganism($taxonId: ID!) {
    organism(taxonId: $taxonId) {
      results {
        taxonId
        name
        genus
        species
        abbreviation
      }
    }
  }
`;

export const PROTEIN_QUERY = `
  query GetProtein($identifier: ID!) {
    protein(identifier: $identifier) {
      results {
        identifier
        name
        length
        sequence
      }
    }
  }
`;

export const STRAIN_QUERY = `
  query GetStrain($identifier: ID!) {
    strain(identifier: $identifier) {
      results {
        identifier
        name
        description
        origin
      }
    }
  }
`;

export const PUBLICATION_QUERY = `
  query GetPublication($doi: ID!) {
    publication(doi: $doi) {
      results {
        doi
        title
        year
      }
    }
  }
`;

export const GENES_SEARCH_QUERY = `
  query SearchGenes($description: String, $page: Int, $pageSize: Int) {
    genes(description: $description, page: $page, pageSize: $pageSize) {
      results {
        identifier
        symbol
        description
      }
      pageInfo {
        currentPage
        pageSize
        hasNextPage
        hasPreviousPage
        pageCount
        numResults
      }
    }
  }
`;

export const ORGANISMS_SEARCH_QUERY = `
  query SearchOrganisms($name: String, $genus: String, $page: Int, $pageSize: Int) {
    organisms(name: $name, genus: $genus, page: $page, pageSize: $pageSize) {
      results {
        taxonId
        name
        genus
        species
        abbreviation
      }
      pageInfo {
        currentPage
        pageSize
        hasNextPage
        hasPreviousPage
        pageCount
        numResults
      }
    }
  }
`;

export const PROTEINS_SEARCH_QUERY = `
  query SearchProteins($description: String, $page: Int, $pageSize: Int) {
    proteins(description: $description, page: $page, pageSize: $pageSize) {
      results {
        identifier
        name
        length
      }
      pageInfo {
        currentPage
        pageSize
        hasNextPage
        hasPreviousPage
        pageCount
        numResults
      }
    }
  }
`;

export const GENE_LINKOUTS_QUERY = `
  query GetGeneLinkouts($identifier: ID!) {
    geneLinkouts(identifier: $identifier) {
      results {
        identifier
        url
        text
        description
      }
    }
  }
`;
