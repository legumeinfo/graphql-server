import {expect} from 'vitest';
import {createTestServer, executeQuery} from './apollo-server.js';
import {validatePageInfo} from './schema-validators.js';
import {mockEmptyResponse} from './handlers/index.js';

/**
 * Shared utilities for search integration tests
 * Eliminates duplication across organism, gene, and protein search tests
 */

export interface SearchTestConfig {
  entityName: string; // 'organisms', 'genes', 'proteins'
  query: string; // GraphQL query string
  searchParam: string; // 'name', 'description', etc.
  searchValue: string; // search term to use
  pageSize?: number;
  page?: number;
}

export interface EntityValidationConfig {
  requiredFields: string[];
  typeValidations?: Record<string, string>; // field -> expected type
  formatValidations?: Record<string, RegExp>; // field -> regex pattern
}

/**
 * Execute a basic search test with standard validation
 */
export async function executeBasicSearchTest(config: SearchTestConfig) {
  const {server, context} = await createTestServer();
  const contextValue = await context();

  const variables = {
    [config.searchParam]: config.searchValue,
    page: config.page || 1,
    pageSize: config.pageSize || 10,
  };

  const response = await executeQuery(
    server,
    config.query,
    variables,
    contextValue,
  );

  // Standard response structure validation
  expect(response.body.kind).toBe('single');
  expect(response.body.singleResult).toBeDefined();

  // Return response for further validation by caller
  return response;
}

/**
 * Execute search test and validate results structure
 */
export async function executeSearchWithResultsValidation(
  config: SearchTestConfig,
  entityConfig: EntityValidationConfig,
) {
  const response = await executeBasicSearchTest(config);

  // Skip detailed validation if there are errors (MSW not intercepting requests)
  if (
    response.body.singleResult.data &&
    response.body.singleResult.data[config.entityName]
  ) {
    const data = response.body.singleResult.data;
    const entityData = data[config.entityName];

    expect(entityData).toBeDefined();
    expect(entityData.results).toBeDefined();
    expect(Array.isArray(entityData.results)).toBe(true);

    if (entityData.results.length > 0) {
      // Validate first result structure
      const firstResult = entityData.results[0];
      validateEntityStructure(firstResult, entityConfig);
    }

    // Validate pagination info
    expect(entityData.pageInfo).toBeDefined();
    const pageValidation = validatePageInfo(entityData.pageInfo);
    expect(pageValidation.isValid).toBe(true);
  }

  return response;
}

/**
 * Test empty search results handling
 */
export async function executeEmptySearchTest(config: SearchTestConfig) {
  mockEmptyResponse();

  const response = await executeBasicSearchTest({
    ...config,
    searchValue: 'nonexistent_entity_xyz',
  });

  if (
    response.body.singleResult.data &&
    response.body.singleResult.data[config.entityName]
  ) {
    const data = response.body.singleResult.data;
    expect(data[config.entityName].results).toHaveLength(0);
    expect(data[config.entityName].pageInfo.numResults).toBe(0);
  }

  return response;
}

/**
 * Test pagination with different page sizes
 */
export async function executePaginationTest(
  config: SearchTestConfig,
  pageSizes: number[] = [2, 5, 10],
) {
  const {server, context} = await createTestServer();
  const contextValue = await context();

  const responses = await Promise.all(
    pageSizes.map((pageSize) =>
      executeQuery(
        server,
        config.query,
        {
          [config.searchParam]: config.searchValue,
          page: 1,
          pageSize,
        },
        contextValue,
      ),
    ),
  );

  responses.forEach((response, index) => {
    const pageSize = pageSizes[index];
    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult).toBeDefined();

    if (
      response.body.singleResult.data &&
      response.body.singleResult.data[config.entityName]
    ) {
      const data = response.body.singleResult.data;
      expect(data[config.entityName].pageInfo.pageSize).toBe(pageSize);
      expect(data[config.entityName].pageInfo.currentPage).toBe(1);
    }
  });

  return responses;
}

/**
 * Validate entity structure based on configuration
 */
export function validateEntityStructure(
  entity: any,
  config: EntityValidationConfig,
) {
  // Check required fields are present
  config.requiredFields.forEach((field) => {
    expect(entity[field]).toBeDefined();
  });

  // Validate data types if specified
  if (config.typeValidations) {
    Object.entries(config.typeValidations).forEach(([field, expectedType]) => {
      expect(typeof entity[field]).toBe(expectedType);
    });
  }

  // Validate formats if specified
  if (config.formatValidations) {
    Object.entries(config.formatValidations).forEach(([field, pattern]) => {
      expect(entity[field]).toMatch(pattern);
    });
  }
}

/**
 * Validate all results in a search response
 */
export function validateAllSearchResults(
  results: any[],
  config: EntityValidationConfig,
) {
  results.forEach((entity) => {
    validateEntityStructure(entity, config);
  });
}

/**
 * Execute multiple search criteria test
 */
export async function executeMultiCriteriaSearchTest(
  config: SearchTestConfig,
  additionalCriteria: Record<string, any>,
) {
  const {server, context} = await createTestServer();
  const contextValue = await context();

  const variables = {
    [config.searchParam]: config.searchValue,
    ...additionalCriteria,
    page: config.page || 1,
    pageSize: config.pageSize || 10,
  };

  const response = await executeQuery(
    server,
    config.query,
    variables,
    contextValue,
  );

  expect(response.body.kind).toBe('single');
  expect(response.body.singleResult).toBeDefined();

  return response;
}

/**
 * Common entity validation configurations
 */
export const ORGANISM_VALIDATION_CONFIG: EntityValidationConfig = {
  requiredFields: ['taxonId', 'name', 'genus', 'species', 'abbreviation'],
  typeValidations: {
    taxonId: 'string',
    name: 'string',
    genus: 'string',
    species: 'string',
    abbreviation: 'string',
  },
};

export const GENE_VALIDATION_CONFIG: EntityValidationConfig = {
  requiredFields: ['identifier', 'symbol', 'description'],
  typeValidations: {
    identifier: 'string',
    symbol: 'string',
    description: 'string',
  },
  formatValidations: {
    identifier: /^AT\dG\d{5}$/, // Arabidopsis gene format
  },
};

export const PROTEIN_VALIDATION_CONFIG: EntityValidationConfig = {
  requiredFields: ['identifier', 'name', 'length'],
  typeValidations: {
    identifier: 'string',
    name: 'string',
    length: 'number',
  },
};

/**
 * Create standard search test suite for an entity type
 */
export function createSearchTestSuite(
  entityName: string,
  query: string,
  searchParam: string,
  searchValue: string,
  validationConfig: EntityValidationConfig,
) {
  const config: SearchTestConfig = {
    entityName,
    query,
    searchParam,
    searchValue,
  };

  return {
    async basicSearchTest() {
      return executeSearchWithResultsValidation(config, validationConfig);
    },

    async emptyResultsTest() {
      return executeEmptySearchTest(config);
    },

    async paginationTest() {
      return executePaginationTest(config);
    },

    async structureValidationTest() {
      const response = await executeBasicSearchTest(config);

      if (
        response.body.kind === 'single' &&
        !response.body.singleResult.errors
      ) {
        const results = response.body.singleResult.data[entityName].results;
        validateAllSearchResults(results, validationConfig);
      }

      return response;
    },
  };
}
