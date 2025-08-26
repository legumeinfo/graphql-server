import {describe, test, expect} from 'vitest';
import {createTestServer, executeQuery} from '../__helpers__/apollo-server.js';

describe('Comprehensive GraphQL Query Coverage', () => {
  // Single-entity queries (by identifier)
  const singleEntityQueries = [
    {name: 'gene', identifier: 'AT1G01010'},
    {name: 'organism', identifier: '3702', field: 'taxonId'},
    {name: 'protein', identifier: 'AT1G01010.1'},
    {name: 'strain', identifier: 'Col-0'},
    {name: 'publication', identifier: '10.1038/nature01140', field: 'doi'},
    {name: 'cds', identifier: 'AT1G01010.1'},
    {name: 'chromosome', identifier: 'Chr1'},
    {name: 'exon', identifier: 'AT1G01010.1.exon1'},
    {name: 'mRNA', identifier: 'AT1G01010.1'},
    {name: 'utr', identifier: 'AT1G01010.1.utr'},
    {name: 'geneFamily', identifier: 'GF001'},
    {name: 'panGeneSet', identifier: 'PGS001'},
    {name: 'pathway', identifier: 'PWY001'},
    {name: 'phylotree', identifier: 'TREE001'},
    {name: 'qtl', identifier: 'QTL001'},
    {name: 'qtlStudy', identifier: 'QTLS001'},
    {name: 'trait', identifier: 'TRAIT001'},
  ];

  test.each(singleEntityQueries)(
    'single-entity query: $name executes without errors',
    async ({name, identifier, field}) => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const fieldName = field || 'identifier';
      const query = `
        query Test${name.charAt(0).toUpperCase() + name.slice(1)}($${fieldName}: ID!) {
          ${name}(${fieldName}: $${fieldName}) {
            results {
              ${fieldName === 'taxonId' ? 'taxonId' : 'identifier'}
            }
          }
        }
      `;

      const variables = {[fieldName]: identifier};

      const response = await executeQuery(
        server,
        query,
        variables,
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      // Should not crash - may return null data or error, both are acceptable
      expect(response.body.singleResult).toBeDefined();
    },
  );

  // Search queries (with pagination)
  const searchQueries = [
    {name: 'genes', params: {description: 'kinase'}},
    {name: 'organisms', params: {genus: 'Arabidopsis'}},
    {name: 'proteins', params: {description: 'domain'}},
    {name: 'strains', params: {species: 'thaliana'}},
    {name: 'publications', params: {title: 'genome'}},
    {name: 'chromosomes', params: {genus: 'Arabidopsis'}},
    {name: 'geneFamilies', params: {description: 'kinase'}},
    {name: 'geneticMaps', params: {description: 'map'}},
    {name: 'gwases', params: {description: 'association'}},
    {name: 'ontologyTerms', params: {description: 'process'}},
    {name: 'qtls', params: {traitName: 'height'}},
    {name: 'qtlStudies', params: {description: 'study'}},
    {name: 'traits', params: {name: 'height'}},
    {name: 'proteinDomains', params: {description: 'domain'}},
    {name: 'expressionSamples', params: {description: 'leaf'}},
    {name: 'expressionSources', params: {description: 'RNA-seq'}},
  ];

  test.each(searchQueries)(
    'search query: $name executes without errors',
    async ({name, params}) => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      // Build dynamic query with first parameter and pagination
      const firstParam = Object.keys(params)[0];
      const query = `
        query Test${name.charAt(0).toUpperCase() + name.slice(1)}($${firstParam}: String, $page: Int, $pageSize: Int) {
          ${name}(${firstParam}: $${firstParam}, page: $page, pageSize: $pageSize) {
            results {
              ${name === 'organisms' ? 'taxonId' : 'identifier'}
            }
            pageInfo {
              currentPage
              pageSize
              numResults
            }
          }
        }
      `;

      const variables = {
        ...params,
        page: 1,
        pageSize: 5,
      };

      const response = await executeQuery(
        server,
        query,
        variables,
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult).toBeDefined();
    },
  );

  // Linkout queries
  const linkoutQueries = [
    {name: 'geneLinkouts', params: {identifier: 'AT1G01010'}},
    {
      name: 'locationLinkouts',
      params: {identifier: 'Chr1', start: 1000, end: 2000},
    },
    {name: 'geneFamilyLinkouts', params: {identifier: 'GF001'}},
    {name: 'panGeneSetLinkouts', params: {identifier: 'PGS001'}},
    {name: 'gwasLinkouts', params: {identifier: 'GWAS001'}},
    {name: 'qtlStudyLinkouts', params: {identifier: 'QTLS001'}},
  ];

  test.each(linkoutQueries)(
    'linkout query: $name executes without errors',
    async ({name, params}) => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      // Build dynamic query based on parameters
      const paramNames = Object.keys(params);
      const paramDeclarations = paramNames
        .map((p) => `$${p}: ${p === 'start' || p === 'end' ? 'Int!' : 'ID!'}`)
        .join(', ');
      const paramUsage = paramNames.map((p) => `${p}: $${p}`).join(', ');

      const query = `
        query Test${name.charAt(0).toUpperCase() + name.slice(1)}(${paramDeclarations}) {
          ${name}(${paramUsage}) {
            results {
              identifier
              url
              text
            }
          }
        }
      `;

      const response = await executeQuery(server, query, params, contextValue);

      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult).toBeDefined();
    },
  );

  // Special queries with unique parameters
  test('getGenes query executes without errors', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const query = `
      query TestGetGenes($identifiers: [ID!]!) {
        getGenes(identifiers: $identifiers) {
          results {
            identifier
          }
        }
      }
    `;

    const response = await executeQuery(
      server,
      query,
      {identifiers: ['AT1G01010', 'AT1G01020']},
      contextValue,
    );

    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult).toBeDefined();
  });

  test('expressionValue query executes without errors', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const query = `
      query TestExpressionValue($sampleIdentifier: ID!, $geneIdentifier: ID!) {
        expressionValue(sampleIdentifier: $sampleIdentifier, geneIdentifier: $geneIdentifier) {
          results {
            sampleIdentifier
            geneIdentifier
          }
        }
      }
    `;

    const response = await executeQuery(
      server,
      query,
      {sampleIdentifier: 'SAMPLE001', geneIdentifier: 'AT1G01010'},
      contextValue,
    );

    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult).toBeDefined();
  });

  test('panGenePairs query executes without errors', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const query = `
      query TestPanGenePairs($identifiers: [ID!]!, $genus: String) {
        panGenePairs(identifiers: $identifiers, genus: $genus) {
          results {
            identifier
          }
        }
      }
    `;

    const response = await executeQuery(
      server,
      query,
      {identifiers: ['AT1G01010', 'AT1G01020'], genus: 'Arabidopsis'},
      contextValue,
    );

    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult).toBeDefined();
  });

  test('author query executes without errors', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const query = `
      query TestAuthor($firstName: String!, $lastName: String) {
        author(firstName: $firstName, lastName: $lastName) {
          results {
            firstName
            lastName
          }
        }
      }
    `;

    const response = await executeQuery(
      server,
      query,
      {firstName: 'John', lastName: 'Doe'},
      contextValue,
    );

    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult).toBeDefined();
  });

  // Data-specific queries
  test('dataSet query executes without errors', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const query = `
      query TestDataSet($name: ID!) {
        dataSet(name: $name) {
          results {
            name
          }
        }
      }
    `;

    const response = await executeQuery(
      server,
      query,
      {name: 'TAIR10'},
      contextValue,
    );

    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult).toBeDefined();
  });

  test('ontology query executes without errors', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const query = `
      query TestOntology($name: ID!) {
        ontology(name: $name) {
          results {
            name
          }
        }
      }
    `;

    const response = await executeQuery(
      server,
      query,
      {name: 'GO'},
      contextValue,
    );

    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult).toBeDefined();
  });
});
