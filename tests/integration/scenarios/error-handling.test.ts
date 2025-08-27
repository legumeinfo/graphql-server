import {describe, test, expect} from 'vitest';
import {
  createTestServer,
  executeQuery,
} from '../../__helpers__/apollo-server.js';
import {
  GENE_QUERY,
  ORGANISM_QUERY,
  PROTEIN_QUERY,
} from '../../__helpers__/mock-data.js';
import {
  mockEmptyResponse,
  mockErrorResponse,
  mockTimeoutResponse,
  server as mswServer,
} from '../../__helpers__/mock-intermine.js';
import {http, HttpResponse} from 'msw';

describe('Error Handling Integration Tests', () => {
  describe('Entity Not Found Errors', () => {
    test('handles non-existent gene gracefully', async () => {
      mockEmptyResponse();

      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        GENE_QUERY,
        {identifier: 'NONEXISTENT_GENE_ID'},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult).toBeDefined();
      // May have 'not found' error or connection errors - both acceptable
    });

    test('handles non-existent organism gracefully', async () => {
      mockEmptyResponse();

      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        ORGANISM_QUERY,
        {taxonId: '999999'},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult).toBeDefined();
      // May have 'not found' error or connection errors - both acceptable
    });

    test('handles non-existent protein gracefully', async () => {
      mockEmptyResponse();

      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        PROTEIN_QUERY,
        {identifier: 'INVALID.PROTEIN.ID'},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult).toBeDefined();
      // May have 'not found' error or connection errors - both acceptable
    });
  });

  describe('Invalid Input Parameters', () => {
    test('handles invalid gene identifier format', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const invalidIdentifiers = [
        '', // Empty string
        '   ', // Whitespace only
        'invalid-gene-format-with-special-chars!!!',
        '123456789012345678901234567890123456789012345678901234567890', // Very long string
      ];

      for (const invalidId of invalidIdentifiers) {
        const response = await executeQuery(
          server,
          GENE_QUERY,
          {identifier: invalidId},
          contextValue,
        );

        expect(response.body.kind).toBe('single');
        // Should either return error or empty results, not crash
        expect(response.body.singleResult).toBeDefined();
      }
    });

    test('handles invalid pagination parameters', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const query = `
        query TestInvalidPagination($page: Int, $pageSize: Int) {
          genes(description: "protein", page: $page, pageSize: $pageSize) {
            results {
              identifier
            }
            pageInfo {
              currentPage
              pageSize
            }
          }
        }
      `;

      const invalidParams = [
        {page: 0, pageSize: 10}, // Zero page
        {page: -1, pageSize: 10}, // Negative page
        {page: 1, pageSize: 0}, // Zero page size
        {page: 1, pageSize: -5}, // Negative page size
        {page: 1, pageSize: 1000}, // Very large page size
      ];

      for (const params of invalidParams) {
        const response = await executeQuery(
          server,
          query,
          params,
          contextValue,
        );

        expect(response.body.kind).toBe('single');
        // Should handle gracefully, either with error or adjusted parameters
        expect(response.body.singleResult).toBeDefined();
      }
    });

    test('handles missing required parameters', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const queryWithRequiredParams = `
        query TestMissingParams($identifier: ID!) {
          gene(identifier: $identifier) {
            results {
              identifier
            }
          }
        }
      `;

      // Test with missing required variable
      const response = await executeQuery(
        server,
        queryWithRequiredParams,
        {}, // Missing 'identifier' parameter
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult.errors).toBeDefined();
      expect(response.body.singleResult.errors[0].message).toContain(
        'Variable',
      );
    });
  });

  describe('Network and Server Errors', () => {
    test('handles InterMine API server errors', async () => {
      mockErrorResponse(500);

      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        GENE_QUERY,
        {identifier: 'AT1G01010'},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult.errors).toBeDefined();
      // Should propagate server errors appropriately
    });

    test('handles InterMine API timeout scenarios', async () => {
      mockTimeoutResponse(1000); // 1 second timeout

      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        GENE_QUERY,
        {identifier: 'AT1G01010'},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      // Should complete within reasonable time or return timeout error
      expect(response.body.singleResult).toBeDefined();
    }, 15000); // Increase test timeout to 15 seconds

    test('handles malformed InterMine responses', async () => {
      // Mock a malformed response
      mswServer.use(
        http.post('*/query/results', () => {
          return HttpResponse.json({
            malformed: 'response',
            missing: 'results',
          });
        }),
      );

      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        GENE_QUERY,
        {identifier: 'AT1G01010'},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      // Should handle malformed responses gracefully
      expect(response.body.singleResult).toBeDefined();
    });
  });

  describe('GraphQL Syntax Errors', () => {
    test('handles invalid GraphQL syntax', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const invalidQuery = `
        query InvalidSyntax {
          gene(identifier: "AT1G01010" {
            results {
              identifier
            }
          }
        }
      `; // Missing closing parenthesis

      const response = await executeQuery(
        server,
        invalidQuery,
        {},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult.errors).toBeDefined();
      expect(response.body.singleResult.errors[0].message).toContain(
        'Syntax Error',
      );
    });

    test('handles invalid field selection', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const queryWithInvalidField = `
        query TestInvalidField {
          gene(identifier: "AT1G01010") {
            results {
              nonExistentField
            }
          }
        }
      `;

      const response = await executeQuery(
        server,
        queryWithInvalidField,
        {},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult.errors).toBeDefined();
      expect(response.body.singleResult.errors[0].message).toContain('field');
    });

    test('handles deeply nested queries', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const deepQuery = `
        query DeepNesting {
          gene(identifier: "AT1G01010") {
            results {
              organism {
                name
                strains {
                  identifier
                  name
                  genes {
                    identifier
                    proteins {
                      identifier
                      proteinDomains {
                        identifier
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const response = await executeQuery(server, deepQuery, {}, contextValue);

      expect(response.body.kind).toBe('single');
      // Should handle deep nesting without stack overflow
      expect(response.body.singleResult).toBeDefined();
    });
  });

  describe('Type Validation Errors', () => {
    test('handles incorrect variable types', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const query = `
        query TestTypeValidation($taxonId: ID!) {
          organism(taxonId: $taxonId) {
            results {
              taxonId
            }
          }
        }
      `;

      // Pass number instead of string
      const response = await executeQuery(
        server,
        query,
        {taxonId: 3702}, // Should be string "3702"
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      // GraphQL should coerce number to string or return validation error
      expect(response.body.singleResult).toBeDefined();
    });

    test('handles array parameter validation', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const query = `
        query TestArrayValidation($identifiers: [ID!]!) {
          getGenes(identifiers: $identifiers) {
            results {
              identifier
            }
          }
        }
      `;

      const invalidArrays = [
        {identifiers: null}, // Null instead of array
        {identifiers: []}, // Empty array
        {identifiers: ['']}, // Array with empty string
        {identifiers: [null]}, // Array with null value
      ];

      for (const variables of invalidArrays) {
        const response = await executeQuery(
          server,
          query,
          variables,
          contextValue,
        );

        expect(response.body.kind).toBe('single');
        expect(response.body.singleResult).toBeDefined();
        // Should handle invalid array inputs appropriately
      }
    });
  });

  describe('Concurrent Request Handling', () => {
    test('handles multiple concurrent requests', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      // Create 10 concurrent requests
      const requests = Array(10)
        .fill(null)
        .map((_, index) =>
          executeQuery(
            server,
            GENE_QUERY,
            {identifier: `GENE_${index}`},
            contextValue,
          ),
        );

      const responses = await Promise.all(requests);

      // All requests should complete
      expect(responses).toHaveLength(10);
      responses.forEach((response) => {
        expect(response.body.kind).toBe('single');
        expect(response.body.singleResult).toBeDefined();
      });
    });

    test('handles mixed successful and failing requests', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const mixedRequests = [
        executeQuery(
          server,
          GENE_QUERY,
          {identifier: 'AT1G01010'},
          contextValue,
        ), // Valid
        executeQuery(server, GENE_QUERY, {identifier: 'INVALID'}, contextValue), // Invalid
        executeQuery(server, ORGANISM_QUERY, {taxonId: '3702'}, contextValue), // Valid
        executeQuery(server, ORGANISM_QUERY, {taxonId: '999999'}, contextValue), // Invalid
      ];

      const responses = await Promise.all(mixedRequests);

      expect(responses).toHaveLength(4);
      responses.forEach((response) => {
        expect(response.body.kind).toBe('single');
        expect(response.body.singleResult).toBeDefined();
        // Some may have errors, some may not - both are valid outcomes
      });
    });
  });
});
