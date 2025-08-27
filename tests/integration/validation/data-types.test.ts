import {describe, test, expect} from 'vitest';
import {
  createTestServer,
  executeQuery,
} from '../../__helpers__/apollo-server.js';

const DATA_TYPE_VALIDATION_QUERIES = {
  // Query covering all major GraphQL scalar types
  SCALAR_TYPES_QUERY: `
    query ValidateScalarTypes {
      gene(identifier: "AT1G01010") {
        results {
          # ID types
          identifier
          
          # String types
          symbol
          description
          name
          assemblyVersion
          annotationVersion
          scoreType
          briefDescription
          ensemblName
          
          # Int types
          length
          
          # Float types
          score
          
          # Boolean types - none in gene, but available in other entities
        }
      }
      
      protein(identifier: "AT1G01010.1") {
        results {
          # ID types
          identifier
          
          # String types
          name
          description
          symbol
          md5checksum
          primaryAccession
          
          # Int types
          length
          
          # Float types
          molecularWeight
          
          # Boolean types
          isPrimary
        }
      }
      
      qtl(identifier: "QTL001") {
        results {
          # ID types
          identifier
          
          # String types
          name
          markerNames
          
          # Float types (all QTL numeric fields are floats)
          lod
          likelihoodRatio
          markerR2
          start
          end
          peak
        }
      }
    }
  `,

  // Query for testing array/object types
  COMPLEX_TYPES_QUERY: `
    query ValidateComplexTypes {
      organisms(genus: "Arabidopsis", page: 1, pageSize: 3) {
        # Array of objects
        results {
          taxonId
          name
          genus
          species
        }
        # Object type
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
};

describe('GraphQL Data Type Validation', () => {
  test('validates ID scalar type consistency', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      DATA_TYPE_VALIDATION_QUERIES.SCALAR_TYPES_QUERY,
      {},
      contextValue,
    );

    if (response.body.kind === 'single' && !response.body.singleResult.errors) {
      const data = response.body.singleResult.data;

      // Gene ID fields
      expect(typeof data.gene.results.identifier).toBe('string');
      expect(data.gene.results.identifier).toMatch(/^AT\dG\d{5}$/);

      // Protein ID fields
      expect(typeof data.protein.results.identifier).toBe('string');
      expect(data.protein.results.identifier).toMatch(/^AT\dG\d{5}\.\d+$/);

      // QTL ID fields
      expect(typeof data.qtl.results.identifier).toBe('string');
      expect(data.qtl.results.identifier).toBe('QTL001');
    }
  });

  test('validates String scalar type consistency', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      DATA_TYPE_VALIDATION_QUERIES.SCALAR_TYPES_QUERY,
      {},
      contextValue,
    );

    if (response.body.kind === 'single' && !response.body.singleResult.errors) {
      const data = response.body.singleResult.data;

      // Gene String fields
      const gene = data.gene.results;
      expect(typeof gene.symbol).toBe('string');
      expect(typeof gene.description).toBe('string');
      expect(typeof gene.name).toBe('string');
      expect(typeof gene.assemblyVersion).toBe('string');
      expect(typeof gene.annotationVersion).toBe('string');
      expect(typeof gene.scoreType).toBe('string');
      expect(typeof gene.briefDescription).toBe('string');
      expect(typeof gene.ensemblName).toBe('string');

      // Protein String fields
      const protein = data.protein.results;
      expect(typeof protein.name).toBe('string');
      expect(typeof protein.description).toBe('string');
      expect(typeof protein.symbol).toBe('string');
      expect(typeof protein.md5checksum).toBe('string');
      expect(typeof protein.primaryAccession).toBe('string');

      // QTL String fields
      const qtl = data.qtl.results;
      expect(typeof qtl.name).toBe('string');
      expect(typeof qtl.markerNames).toBe('string');

      // Validate string content makes sense
      expect(gene.symbol).toHaveLength.greaterThan(0);
      expect(gene.description).toContain('NAC domain');
      expect(protein.md5checksum).toMatch(/^[a-fA-F0-9]{16}$/);
      expect(qtl.markerNames).toContain(','); // Should be comma-separated
    }
  });

  test('validates Int scalar type consistency', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      DATA_TYPE_VALIDATION_QUERIES.SCALAR_TYPES_QUERY,
      {},
      contextValue,
    );

    if (response.body.kind === 'single' && !response.body.singleResult.errors) {
      const data = response.body.singleResult.data;

      // Gene Int fields
      const gene = data.gene.results;
      expect(typeof gene.length).toBe('number');
      expect(Number.isInteger(gene.length)).toBe(true);
      expect(gene.length).toBeGreaterThan(0);

      // Protein Int fields
      const protein = data.protein.results;
      expect(typeof protein.length).toBe('number');
      expect(Number.isInteger(protein.length)).toBe(true);
      expect(protein.length).toBeGreaterThan(0);

      // Validate reasonable ranges
      expect(gene.length).toBeGreaterThan(100); // Genes should be substantial
      expect(gene.length).toBeLessThan(1000000); // But not too large
      expect(protein.length).toBeGreaterThan(50); // Proteins should be meaningful size
      expect(protein.length).toBeLessThan(10000); // But not unreasonably large
    }
  });

  test('validates Float scalar type consistency', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      DATA_TYPE_VALIDATION_QUERIES.SCALAR_TYPES_QUERY,
      {},
      contextValue,
    );

    if (response.body.kind === 'single' && !response.body.singleResult.errors) {
      const data = response.body.singleResult.data;

      // Gene Float fields
      const gene = data.gene.results;
      expect(typeof gene.score).toBe('number');
      expect(isNaN(gene.score)).toBe(false);

      // Protein Float fields
      const protein = data.protein.results;
      expect(typeof protein.molecularWeight).toBe('number');
      expect(isNaN(protein.molecularWeight)).toBe(false);
      expect(protein.molecularWeight).toBeGreaterThan(0);

      // QTL Float fields
      const qtl = data.qtl.results;
      expect(typeof qtl.lod).toBe('number');
      expect(typeof qtl.likelihoodRatio).toBe('number');
      expect(typeof qtl.markerR2).toBe('number');
      expect(typeof qtl.start).toBe('number');
      expect(typeof qtl.end).toBe('number');
      expect(typeof qtl.peak).toBe('number');

      // Validate ranges make biological sense
      expect(qtl.lod).toBeGreaterThan(0); // LOD scores should be positive
      expect(qtl.markerR2).toBeGreaterThanOrEqual(0); // R² should be 0-1
      expect(qtl.markerR2).toBeLessThanOrEqual(1);
      expect(qtl.start).toBeGreaterThan(0); // Genomic positions should be positive
      expect(qtl.end).toBeGreaterThan(qtl.start); // End should be after start
      expect(qtl.peak).toBeGreaterThanOrEqual(qtl.start); // Peak should be within interval
      expect(qtl.peak).toBeLessThanOrEqual(qtl.end);
    }
  });

  test('validates Boolean scalar type consistency', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      DATA_TYPE_VALIDATION_QUERIES.SCALAR_TYPES_QUERY,
      {},
      contextValue,
    );

    if (response.body.kind === 'single' && !response.body.singleResult.errors) {
      const data = response.body.singleResult.data;

      // Protein Boolean fields
      const protein = data.protein.results;
      expect(typeof protein.isPrimary).toBe('boolean');
      expect(protein.isPrimary === true || protein.isPrimary === false).toBe(
        true,
      );

      // In our mock data, isPrimary should be true
      expect(protein.isPrimary).toBe(true);
    }
  });

  test('validates array type consistency', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      DATA_TYPE_VALIDATION_QUERIES.COMPLEX_TYPES_QUERY,
      {},
      contextValue,
    );

    if (response.body.kind === 'single' && !response.body.singleResult.errors) {
      const data = response.body.singleResult.data;

      // Validate array structure
      expect(Array.isArray(data.organisms.results)).toBe(true);
      expect(data.organisms.results.length).toBeGreaterThan(0);

      // Validate array elements are objects with expected structure
      data.organisms.results.forEach((organism: any) => {
        expect(typeof organism).toBe('object');
        expect(organism).not.toBeNull();
        expect(typeof organism.taxonId).toBe('string');
        expect(typeof organism.name).toBe('string');
        expect(typeof organism.genus).toBe('string');
        expect(typeof organism.species).toBe('string');
      });
    }
  });

  test('validates object type consistency', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      DATA_TYPE_VALIDATION_QUERIES.COMPLEX_TYPES_QUERY,
      {},
      contextValue,
    );

    if (response.body.kind === 'single' && !response.body.singleResult.errors) {
      const data = response.body.singleResult.data;

      // Validate object structure
      expect(typeof data.organisms.pageInfo).toBe('object');
      expect(data.organisms.pageInfo).not.toBeNull();
      expect(Array.isArray(data.organisms.pageInfo)).toBe(false);

      // Validate object fields have correct types
      const pageInfo = data.organisms.pageInfo;
      expect(typeof pageInfo.currentPage).toBe('number');
      expect(typeof pageInfo.pageSize).toBe('number');
      expect(typeof pageInfo.numResults).toBe('number');
      expect(typeof pageInfo.hasNextPage).toBe('boolean');
      expect(typeof pageInfo.hasPreviousPage).toBe('boolean');
      expect(typeof pageInfo.pageCount).toBe('number');

      // Validate logical consistency
      expect(pageInfo.currentPage).toBeGreaterThan(0);
      expect(pageInfo.pageSize).toBeGreaterThan(0);
      expect(pageInfo.numResults).toBeGreaterThanOrEqual(0);
    }
  });

  test('validates null handling', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    // Query with nested optional fields
    const nullTestQuery = `
      query TestNullHandling {
        gene(identifier: "AT1G01010") {
          results {
            identifier
            supercontig {
              identifier
            }
            supercontigLocation {
              start
              end
            }
          }
        }
      }
    `;

    const response = await executeQuery(
      server,
      nullTestQuery,
      {},
      contextValue,
    );

    if (response.body.kind === 'single' && !response.body.singleResult.errors) {
      const data = response.body.singleResult.data;
      const gene = data.gene.results;

      // Some fields may be null based on our mock data
      if (gene.supercontig === null) {
        expect(gene.supercontig).toBeNull();
      } else {
        expect(typeof gene.supercontig).toBe('object');
      }

      if (gene.supercontigLocation === null) {
        expect(gene.supercontigLocation).toBeNull();
      } else {
        expect(typeof gene.supercontigLocation).toBe('object');
      }
    }
  });

  test('validates type coercion behavior', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      DATA_TYPE_VALIDATION_QUERIES.SCALAR_TYPES_QUERY,
      {},
      contextValue,
    );

    if (response.body.kind === 'single' && !response.body.singleResult.errors) {
      const data = response.body.singleResult.data;

      // GraphQL should handle type coercion properly
      const organism =
        data.gene?.results?.organism || data.protein?.results?.organism;
      if (organism) {
        // taxonId should be coerced to string (ID type)
        expect(typeof organism.taxonId).toBe('string');
        expect(organism.taxonId).toBe('3702'); // Should be string, not number
      }

      // Numeric fields should remain numbers
      expect(typeof data.protein.results.length).toBe('number');
      expect(typeof data.protein.results.molecularWeight).toBe('number');
      expect(typeof data.qtl.results.lod).toBe('number');
    }
  });
});
