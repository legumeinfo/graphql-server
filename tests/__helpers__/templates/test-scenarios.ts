/**
 * Reusable test scenario templates
 * Purpose: Eliminate test duplication by providing standardized testing patterns
 * Each template includes clear biological context and expected outcomes
 */

import type {ApolloServer} from '@apollo/server';

export interface TestScenario {
  name: string;
  purpose: string;
  biologicalContext: string;
  graphqlFeature: string;
  query: string;
  variables?: Record<string, any>;
  expectedFields: string[];
  assertions: (data: any) => void;
}

export interface EntityTestSuite {
  entityType: string;
  scenarios: TestScenario[];
}

/**
 * Single entity test template
 * Purpose: Test retrieval of individual biological entities by identifier
 */
export const createSingleEntityTest = (
  entityType: string,
  identifier: string,
  expectedFields: string[],
  biologicalContext: string,
): TestScenario => {
  // Expand organism field to include required subfields
  const expandedFields = expectedFields.map((field) => {
    if (field === 'organism') {
      return 'organism { taxonId name genus species }';
    }
    return field;
  });

  return {
    name: `fetch_single_${entityType}`,
    purpose: `Validates retrieval of individual ${entityType} by unique identifier`,
    biologicalContext,
    graphqlFeature: 'Single entity query with field selection',
    query: `
      query GetSingle${entityType.charAt(0).toUpperCase() + entityType.slice(1)}($identifier: ID!) {
        ${entityType}(identifier: $identifier) {
          results {
            ${expandedFields.join('\n            ')}
          }
        }
      }
    `,
    variables: {identifier},
    expectedFields,
    assertions: (data: any) => {
      expect(data).toBeDefined();
      expect(data[entityType]).toBeDefined();
      expect(data[entityType].results).toBeDefined();
      expectedFields.forEach((field) => {
        if (field === 'organism') {
          expect(data[entityType].results.organism).toBeDefined();
        } else {
          expect(data[entityType].results).toHaveProperty(field);
        }
      });
    },
  };
};

/**
 * Search query test template
 * Purpose: Test paginated search functionality across entities
 */
export const createSearchQueryTest = (
  entityType: string,
  searchTerm: string,
  expectedCount: number,
  biologicalContext: string,
): TestScenario => ({
  name: `search_${entityType}s`,
  purpose: `Validates search functionality for ${entityType}s with pagination`,
  biologicalContext,
  graphqlFeature: 'Search query with pagination and filtering',
  query: `
    query Search${entityType.charAt(0).toUpperCase() + entityType.slice(1)}s($description: String, $page: Int, $pageSize: Int) {
      ${entityType}s(description: $description, page: $page, pageSize: $pageSize) {
        results {
          identifier
          ${entityType === 'gene' ? 'symbol' : entityType === 'organism' ? 'genus' : 'name'}
          description
        }
        pageInfo {
          currentPage
          pageSize
          numResults
          hasNextPage
          hasPreviousPage
          pageCount
        }
      }
    }
  `,
  variables: {description: searchTerm, page: 1, pageSize: 10},
  expectedFields: ['results', 'pageInfo'],
  assertions: (data: any) => {
    const entityResults = data[`${entityType}s`];
    expect(entityResults).toBeDefined();
    expect(entityResults.results).toBeInstanceOf(Array);
    expect(entityResults.results.length).toBeGreaterThanOrEqual(1);
    expect(entityResults.results.length).toBeLessThanOrEqual(expectedCount);
    expect(entityResults.pageInfo).toBeDefined();
    expect(entityResults.pageInfo.currentPage).toBe(1);
    expect(entityResults.pageInfo.pageSize).toBe(10);
  },
});

/**
 * Relationship query test template
 * Purpose: Test complex nested GraphQL queries with biological relationships
 */
export const createRelationshipTest = (
  parentEntity: string,
  childEntity: string,
  identifier: string,
  biologicalContext: string,
): TestScenario => ({
  name: `${parentEntity}_${childEntity}_relationship`,
  purpose: `Validates ${parentEntity} to ${childEntity} biological relationship resolution`,
  biologicalContext,
  graphqlFeature: 'Nested field resolution with biological constraints',
  query: `
    query Get${parentEntity.charAt(0).toUpperCase() + parentEntity.slice(1)}With${childEntity.charAt(0).toUpperCase() + childEntity.slice(1)}($identifier: ID!) {
      ${parentEntity}(identifier: $identifier) {
        results {
          identifier
          ${
            childEntity === 'organism'
              ? 'organism { taxonId name genus species }'
              : childEntity === 'protein'
                ? 'proteins { identifier isPrimary length }'
                : childEntity === 'gene'
                  ? 'genes { identifier symbol description }'
                  : `${childEntity}s { identifier name }`
          }
        }
      }
    }
  `,
  variables: {identifier},
  expectedFields: [
    'identifier',
    childEntity === 'organism' ? 'organism' : `${childEntity}s`,
  ],
  assertions: (data: any) => {
    if (!data || !data[parentEntity] || !data[parentEntity].results) {
      throw new Error(
        `Expected ${parentEntity} data but got: ${JSON.stringify(data)}`,
      );
    }
    const entity = data[parentEntity].results;
    expect(entity).toBeDefined();
    expect(entity.identifier).toBe(identifier);

    if (childEntity === 'organism') {
      expect(entity.organism).toBeDefined();
      expect(entity.organism.taxonId).toBeDefined();
    } else {
      expect(entity[`${childEntity}s`]).toBeDefined();
      expect(Array.isArray(entity[`${childEntity}s`])).toBe(true);
    }
  },
});

/**
 * Error handling test template
 * Purpose: Test graceful handling of various error conditions
 */
export const createErrorHandlingTest = (
  entityType: string,
  errorType: 'not_found' | 'invalid_format' | 'server_error',
  biologicalContext: string,
): TestScenario => {
  const errorScenarios = {
    not_found: {
      variables: {identifier: 'NONEXISTENT_ID_12345'},
      purpose: 'entity not found in database',
    },
    invalid_format: {
      variables: {identifier: '!!!INVALID_FORMAT!!!'},
      purpose: 'invalid identifier format',
    },
    server_error: {
      variables: {identifier: 'VALID_ID'},
      purpose: 'server error response',
    },
  };

  const scenario = errorScenarios[errorType];

  return {
    name: `${entityType}_error_${errorType}`,
    purpose: `Validates graceful handling when ${scenario.purpose}`,
    biologicalContext,
    graphqlFeature: 'Error handling and graceful degradation',
    query: `
      query ErrorTest${entityType.charAt(0).toUpperCase() + entityType.slice(1)}($identifier: ID!) {
        ${entityType}(identifier: $identifier) {
          results {
            identifier
          }
        }
      }
    `,
    variables: scenario.variables,
    expectedFields: [],
    assertions: (data: any, response: any) => {
      // Should not crash - either return null data or error
      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult).toBeDefined();

      if (response.body.singleResult.errors) {
        expect(response.body.singleResult.errors).toBeInstanceOf(Array);
        expect(response.body.singleResult.errors.length).toBeGreaterThan(0);
      }
    },
  };
};

/**
 * Pagination test template
 * Purpose: Test pagination consistency across different page sizes and pages
 */
export const createPaginationTest = (
  entityType: string,
  biologicalContext: string,
): TestScenario => ({
  name: `${entityType}_pagination_consistency`,
  purpose: `Validates pagination consistency across different page sizes for ${entityType}s`,
  biologicalContext,
  graphqlFeature: 'Pagination with page size variations and navigation',
  query: `
    query Pagination${entityType.charAt(0).toUpperCase() + entityType.slice(1)}s($page: Int, $pageSize: Int) {
      ${entityType}s(page: $page, pageSize: $pageSize) {
        results {
          identifier
        }
        pageInfo {
          currentPage
          pageSize
          numResults
          pageCount
          hasNextPage
          hasPreviousPage
        }
      }
    }
  `,
  variables: {page: 1, pageSize: 3},
  expectedFields: ['results', 'pageInfo'],
  assertions: (data: any) => {
    const entityResults = data[`${entityType}s`];
    expect(entityResults.pageInfo.currentPage).toBe(1);
    expect(entityResults.pageInfo.pageSize).toBe(3);
    expect(entityResults.results.length).toBeLessThanOrEqual(3);
    expect(entityResults.pageInfo.hasPreviousPage).toBe(false);
    expect(typeof entityResults.pageInfo.hasNextPage).toBe('boolean');
  },
});

/**
 * Biological validation test template
 * Purpose: Test biological data consistency and constraints
 */
export const createBiologicalValidationTest = (
  entityType: string,
  validationRules: Record<string, (value: any) => boolean>,
  biologicalContext: string,
): TestScenario => ({
  name: `${entityType}_biological_validation`,
  purpose: `Validates biological data consistency and constraints for ${entityType}`,
  biologicalContext,
  graphqlFeature: 'Data validation with biological constraints',
  query: `
    query Validate${entityType.charAt(0).toUpperCase() + entityType.slice(1)}($identifier: ID!) {
      ${entityType}(identifier: $identifier) {
        results {
          ${Object.keys(validationRules).join('\n          ')}
        }
      }
    }
  `,
  variables: {identifier: 'AT1G01010'},
  expectedFields: Object.keys(validationRules),
  assertions: (data: any) => {
    const entity = data[entityType].results;
    Object.entries(validationRules).forEach(([field, validator]) => {
      const value = entity[field];
      expect(validator(value)).toBe(true);
    });
  },
});

/**
 * Pre-defined test suites for common biological entities
 */
export const standardTestSuites: Record<string, EntityTestSuite> = {
  gene: {
    entityType: 'gene',
    scenarios: [
      createSingleEntityTest(
        'gene',
        'AT1G01010',
        ['identifier', 'symbol', 'description', 'organism'],
        'Central dogma: Genes encode instructions for protein synthesis',
      ),
      createSearchQueryTest(
        'gene',
        'kinase',
        3,
        'Gene search: Finding genes by functional annotation (enzyme classification)',
      ),
      createRelationshipTest(
        'gene',
        'protein',
        'AT1G01010',
        'Gene-protein relationship: One gene can produce multiple protein isoforms',
      ),
      createBiologicalValidationTest(
        'gene',
        {
          identifier: (val: string) => /^AT[1-5]G\d{5}$/.test(val), // Arabidopsis gene ID format
          length: (val: number) => val > 0 && val < 50000, // Reasonable gene length
        },
        'Gene identifier and length validation following biological standards',
      ),
    ],
  },

  protein: {
    entityType: 'protein',
    scenarios: [
      createSingleEntityTest(
        'protein',
        'AT1G01010.1',
        ['identifier', 'length', 'molecularWeight', 'isPrimary'],
        'Protein structure: Length and molecular weight determine function',
      ),
      createRelationshipTest(
        'protein',
        'gene',
        'AT1G01010.1',
        'Protein-gene relationship: Every protein is encoded by a gene',
      ),
      createBiologicalValidationTest(
        'protein',
        {
          length: (val: number) => val > 10 && val < 5000, // Reasonable protein length
          molecularWeight: (val: number) => val > 1000 && val < 500000, // Reasonable MW
        },
        'Protein size validation: Molecular weight should correlate with amino acid length',
      ),
    ],
  },

  organism: {
    entityType: 'organism',
    scenarios: [
      createSingleEntityTest(
        'organism',
        '3702',
        ['taxonId', 'name', 'genus', 'species'],
        'Taxonomic classification: Organisms are identified by unique NCBI taxonomy IDs',
      ),
      createSearchQueryTest(
        'organism',
        'legume',
        4,
        'Organism search: Finding related species by taxonomic or common name',
      ),
      createBiologicalValidationTest(
        'organism',
        {
          taxonId: (val: string) => /^\d+$/.test(val), // Numeric taxon ID
          genus: (val: string) => val.length > 0 && /^[A-Z][a-z]+$/.test(val), // Proper genus format
        },
        'Taxonomic naming validation: Genus should be capitalized, species lowercase',
      ),
    ],
  },
};

/**
 * Test execution utility
 * Purpose: Execute test scenarios with proper setup and teardown
 */
export async function executeTestScenario(
  server: ApolloServer,
  contextValue: any,
  scenario: TestScenario,
) {
  console.log(`\n=== ${scenario.name} ===`);
  console.log(`Purpose: ${scenario.purpose}`);
  console.log(`Biological context: ${scenario.biologicalContext}`);
  console.log(`GraphQL feature: ${scenario.graphqlFeature}`);

  const response = await server.executeOperation(
    {
      query: scenario.query,
      variables: scenario.variables || {},
    },
    {contextValue},
  );

  // Run assertions
  if (response.body.kind === 'single' && response.body.singleResult.data) {
    scenario.assertions(response.body.singleResult.data, response);
  } else {
    // Handle error cases
    if (scenario.name.includes('error')) {
      scenario.assertions(null, response);
    } else {
      throw new Error(`Query failed: ${JSON.stringify(response.body)}`);
    }
  }

  return response;
}
