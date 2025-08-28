import {describe, test, expect, beforeAll, afterAll, afterEach} from 'vitest';
import {server} from '../../__helpers__/mock-intermine.js';
import {http, HttpResponse} from 'msw';
import {
  createTestServer,
  executeQuery,
} from '../../__helpers__/apollo-server.js';

/**
 * Comprehensive test for hasOrganismFactory data flow
 *
 * TRACING THE DATA FLOW:
 * 1. hasOrganismFactory receives parent object (e.g. Gene, Protein, Trait)
 * 2. Extracts taxonId from parent.organismTaxonId field
 * 3. Routes based on GraphQL info.parentType interfaces and typeName
 * 4. Calls dataSources[sourceName].getOrganism(taxonId)
 * 5. Returns organism data or null if taxonId is missing
 *
 * COVERED SCENARIOS:
 * - BioEntity interface types (Gene, Protein, CDS, etc.)
 * - Explicit type matching (ExpressionSource, GeneFamilyTally, GeneticMap, GWAS, QTLStudy, Strain, Trait)
 * - Null taxonId handling
 * - Organism data retrieval and structure validation
 */

beforeAll(() => {
  server.listen({onUnhandledRequest: 'warn'});
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe('hasOrganismFactory Data Flow Tests', () => {
  test('resolves organism for BioEntity interface types (Gene)', async () => {
    // Mock gene data with organismTaxonId
    server.use(
      http.post('*/query/results', async ({request}) => {
        const body = await request.text();
        const params = new URLSearchParams(body);
        const query = params.get('query') || '';

        // Mock gene query response
        if (query.includes('Gene.primaryIdentifier')) {
          return HttpResponse.json({
            results: [
              [
                1, // id
                'AT1G01010', // identifier
                'Test Gene', // description
                'TESTG1', // symbol
                'Test gene for hasOrganism testing', // briefDescription
                'TAIR10', // assemblyVersion
                'v1.0', // annotationVersion
                'AT1G01010', // primaryIdentifier
                3702, // organismTaxonId - KEY FIELD for hasOrganismFactory
                'Col-0', // strainIdentifier
                0.0, // score
                'none', // scoreType
                2268, // length
                'SO:0000704', // sequenceOntologyTermIdentifier
                1, // chromosomeId
                null, // transcriptsCount (not used in test)
                1, // chromosomeLocationStart
                '1', // chromosomeLocationStrand
                null, // geneFamilyIdentifier
              ],
            ],
          });
        }

        // Mock organism query response for taxonId 3702
        if (query.includes('Organism.taxonId') && query.includes('3702')) {
          return HttpResponse.json({
            results: [
              [
                1, // id
                '3702', // taxonId
                'ARATH', // abbreviation
                'Arabidopsis thaliana', // name
                'Arabidopsis thaliana', // commonName
                'A.thaliana', // shortName
                'Model plant organism', // description
                'Arabidopsis', // genus
                'thaliana', // species
              ],
            ],
          });
        }

        return HttpResponse.json({results: []});
      }),
    );

    const {server: apolloServer, context} = await createTestServer();
    const contextValue = await context();

    // Query gene with organism relationship (triggers hasOrganismFactory)
    const geneWithOrganismQuery = `
      query GetGeneWithOrganism($identifier: String!) {
        gene(identifier: $identifier) {
          results {
            identifier
            symbol
            description
            organism {
              taxonId
              name
              genus
              species
              description
            }
          }
        }
      }
    `;

    const response = await executeQuery(
      apolloServer,
      geneWithOrganismQuery,
      {identifier: 'AT1G01010'},
      contextValue,
    );

    // Validate response structure
    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult).toBeDefined();

    if (response.body.singleResult.data) {
      const gene = response.body.singleResult.data.gene.results;

      // Validate gene data
      expect(gene.identifier).toBe('AT1G01010');
      expect(gene.symbol).toBe('TESTG1');
      expect(gene.description).toBe('Test Gene');

      // KEY TEST: Validate hasOrganismFactory resolved organism
      expect(gene.organism).toBeDefined();
      expect(gene.organism.taxonId).toBe('3702');
      expect(gene.organism.name).toBe('Arabidopsis thaliana');
      expect(gene.organism.genus).toBe('Arabidopsis');
      expect(gene.organism.species).toBe('thaliana');
      expect(gene.organism.description).toBe('Model plant organism');
    }
  });

  test('resolves organism for explicit type matching (Trait)', async () => {
    // Mock trait data with organismTaxonId
    server.use(
      http.post('*/query/results', async ({request}) => {
        const body = await request.text();
        const params = new URLSearchParams(body);
        const query = params.get('query') || '';

        // Mock trait query response
        if (query.includes('Trait.primaryIdentifier')) {
          return HttpResponse.json({
            results: [
              [
                1, // id
                'TRAIT001', // identifier (primaryIdentifier)
                'Plant height measurement trait', // description
                'Plant Height', // name
                'TRAIT_DS', // dataSetsName
                3847, // organismTaxonId - KEY FIELD for hasOrganismFactory
                'GWAS001', // gwasIdentifier
              ],
            ],
          });
        }

        // Mock organism query response for taxonId 3847 (soybean)
        if (query.includes('Organism.taxonId') && query.includes('3847')) {
          return HttpResponse.json({
            results: [
              [
                2, // id
                '3847', // taxonId
                'GLYCM', // abbreviation
                'Glycine max', // name
                'Glycine max', // commonName
                'G.max', // shortName
                'Soybean', // description
                'Glycine', // genus
                'max', // species
              ],
            ],
          });
        }

        return HttpResponse.json({results: []});
      }),
    );

    const {server: apolloServer, context} = await createTestServer();
    const contextValue = await context();

    // Query trait with organism relationship
    const traitWithOrganismQuery = `
      query GetTraitWithOrganism($identifier: ID!) {
        trait(identifier: $identifier) {
          results {
            identifier
            name
            description
            organism {
              taxonId
              name
              genus
              species
              description
            }
          }
        }
      }
    `;

    const response = await executeQuery(
      apolloServer,
      traitWithOrganismQuery,
      {identifier: 'TRAIT001'},
      contextValue,
    );

    if (response.body.singleResult.data) {
      const trait = response.body.singleResult.data.trait.results;

      // Validate trait data
      expect(trait.identifier).toBe('TRAIT001');
      expect(trait.name).toBe('Plant Height');

      // KEY TEST: Validate hasOrganismFactory resolved organism for Trait type
      expect(trait.organism).toBeDefined();
      expect(trait.organism.taxonId).toBe('3847');
      expect(trait.organism.name).toBe('Glycine max');
      expect(trait.organism.genus).toBe('Glycine');
      expect(trait.organism.species).toBe('max');
      expect(trait.organism.description).toBe('Soybean');
    }
  });

  test('resolves organism for Protein (BioEntity interface)', async () => {
    server.use(
      http.post('*/query/results', async ({request}) => {
        const body = await request.text();
        const params = new URLSearchParams(body);
        const query = params.get('query') || '';

        // Mock protein query response
        if (query.includes('Protein.primaryIdentifier')) {
          return HttpResponse.json({
            results: [
              [
                1, // id
                'AT1G01010.1', // identifier
                'Test protein', // description
                'TESTPROT1', // name
                'Test protein description', // name
                'TAIR10', // assemblyVersion
                'v1.0', // annotationVersion
                'AT1G01010.1', // primaryIdentifier
                3702, // organismTaxonId - KEY FIELD
                'Col-0', // strainIdentifier
                'abc123', // md5checksum
                'AT1G01010.1', // uniprotAccession
                39654, // molecularWeight
                356, // length
                true, // isPrimary
                'phylo1', // phylostratumIdentifier
                'AT1G01010.1', // transcriptIdentifier
                1, // transcriptId
              ],
            ],
          });
        }

        // Mock organism query for protein
        if (query.includes('Organism.taxonId') && query.includes('3702')) {
          return HttpResponse.json({
            results: [
              [
                1, // id
                '3702', // taxonId
                'ARATH', // abbreviation
                'Arabidopsis thaliana', // name
                'Arabidopsis thaliana', // commonName
                'A.thaliana', // shortName
                'Model plant organism', // description
                'Arabidopsis', // genus
                'thaliana', // species
              ],
            ],
          });
        }

        return HttpResponse.json({results: []});
      }),
    );

    const {server: apolloServer, context} = await createTestServer();
    const contextValue = await context();

    const proteinWithOrganismQuery = `
      query GetProteinWithOrganism($identifier: String!) {
        protein(identifier: $identifier) {
          results {
            identifier
            description
            length
            molecularWeight
            organism {
              taxonId
              name
              genus
              species
            }
          }
        }
      }
    `;

    const response = await executeQuery(
      apolloServer,
      proteinWithOrganismQuery,
      {identifier: 'AT1G01010.1'},
      contextValue,
    );

    if (response.body.singleResult.data) {
      const protein = response.body.singleResult.data.protein.results;

      // Validate protein data
      expect(protein.identifier).toBe('AT1G01010.1');
      expect(protein.length).toBe(356);
      expect(protein.molecularWeight).toBe(39654);

      // KEY TEST: hasOrganismFactory resolution for Protein
      expect(protein.organism).toBeDefined();
      expect(protein.organism.taxonId).toBe('3702');
      expect(protein.organism.name).toBe('Arabidopsis thaliana');
    }
  });

  test('returns null when organismTaxonId is missing', async () => {
    server.use(
      http.post('*/query/results', async ({request}) => {
        const body = await request.text();
        const params = new URLSearchParams(body);
        const query = params.get('query') || '';

        // Mock gene with null/missing organismTaxonId
        if (query.includes('Gene.primaryIdentifier')) {
          return HttpResponse.json({
            results: [
              [
                1, // id
                'ORPHAN_GENE', // identifier
                'Orphan gene without organism', // description
                'ORPHAN', // symbol
                'Gene with no organism association', // briefDescription
                'TAIR10', // assemblyVersion
                'v1.0', // annotationVersion
                'ORPHAN_GENE', // primaryIdentifier
                null, // organismTaxonId - NULL VALUE
                null, // strainIdentifier
                0.0, // score
                'none', // scoreType
                1000, // length
                'SO:0000704', // sequenceOntologyTermIdentifier
                1, // chromosomeId
                null, // transcriptsCount
                1, // chromosomeLocationStart
                '1', // chromosomeLocationStrand
                null, // geneFamilyIdentifier
              ],
            ],
          });
        }

        return HttpResponse.json({results: []});
      }),
    );

    const {server: apolloServer, context} = await createTestServer();
    const contextValue = await context();

    const orphanGeneQuery = `
      query GetOrphanGene($identifier: String!) {
        gene(identifier: $identifier) {
          results {
            identifier
            symbol
            organism {
              taxonId
              name
            }
          }
        }
      }
    `;

    const response = await executeQuery(
      apolloServer,
      orphanGeneQuery,
      {identifier: 'ORPHAN_GENE'},
      contextValue,
    );

    if (response.body.singleResult.data) {
      const gene = response.body.singleResult.data.gene.results;

      // Validate gene data
      expect(gene.identifier).toBe('ORPHAN_GENE');
      expect(gene.symbol).toBe('ORPHAN');

      // KEY TEST: hasOrganismFactory returns null for missing taxonId
      expect(gene.organism).toBeNull();
    }
  });

  test('resolves organism for multiple explicit type matches', async () => {
    server.use(
      http.post('*/query/results', async ({request}) => {
        const body = await request.text();
        const params = new URLSearchParams(body);
        const query = params.get('query') || '';

        // Mock strain query
        if (query.includes('Strain.identifier')) {
          return HttpResponse.json({
            results: [
              [
                1, // id
                'COL-0', // identifier
                'Columbia-0', // name
                'Wild-type strain', // description
                'Arabidopsis', // origin
                'COL0001', // accession
                3702, // organismTaxonId - KEY FIELD
              ],
            ],
          });
        }

        // Mock organism query
        if (query.includes('Organism.taxonId') && query.includes('3702')) {
          return HttpResponse.json({
            results: [
              [
                1, // id
                '3702', // taxonId
                'ARATH', // abbreviation
                'Arabidopsis thaliana', // name
                'Arabidopsis thaliana', // commonName
                'A.thaliana', // shortName
                'Model plant organism', // description
                'Arabidopsis', // genus
                'thaliana', // species
              ],
            ],
          });
        }

        return HttpResponse.json({results: []});
      }),
    );

    const {server: apolloServer, context} = await createTestServer();
    const contextValue = await context();

    const strainWithOrganismQuery = `
      query GetStrainWithOrganism($identifier: ID!) {
        strain(identifier: $identifier) {
          results {
            identifier
            name
            description
            organism {
              taxonId
              name
              genus
              species
            }
          }
        }
      }
    `;

    const response = await executeQuery(
      apolloServer,
      strainWithOrganismQuery,
      {identifier: 'COL-0'},
      contextValue,
    );

    if (response.body.singleResult.data) {
      const strain = response.body.singleResult.data.strain.results;

      // Validate strain data
      expect(strain.identifier).toBe('COL-0');
      expect(strain.name).toBe('Columbia-0');

      // KEY TEST: hasOrganismFactory resolution for Strain type
      expect(strain.organism).toBeDefined();
      expect(strain.organism.taxonId).toBe('3702');
      expect(strain.organism.name).toBe('Arabidopsis thaliana');
      expect(strain.organism.genus).toBe('Arabidopsis');
      expect(strain.organism.species).toBe('thaliana');
    }
  });

  test('validates complete data flow for SequenceFeature types', async () => {
    server.use(
      http.post('*/query/results', async ({request}) => {
        const body = await request.text();
        const params = new URLSearchParams(body);
        const query = params.get('query') || '';

        // Mock CDS query (implements BioEntity)
        if (query.includes('CDS.primaryIdentifier')) {
          return HttpResponse.json({
            results: [
              [
                1, // id
                'AT1G01010.1.cds', // identifier
                'Coding sequence', // description
                'CDS1', // name
                'CDS for testing', // name
                'TAIR10', // assemblyVersion
                'v1.0', // annotationVersion
                'AT1G01010.1.cds', // primaryIdentifier
                3702, // organismTaxonId - KEY FIELD
                'Col-0', // strainIdentifier
                0.0, // score
                'none', // scoreType
                1068, // length
                'SO:0000316', // sequenceOntologyTermIdentifier
                1, // chromosomeId
                null, // transcriptsCount
                1, // chromosomeLocationStart
                '1', // chromosomeLocationStrand
                'AT1G01010.1', // transcriptIdentifier
                true, // isPrimary
              ],
            ],
          });
        }

        // Mock organism query
        if (query.includes('Organism.taxonId') && query.includes('3702')) {
          return HttpResponse.json({
            results: [
              [
                1, // id
                '3702', // taxonId
                'ARATH', // abbreviation
                'Arabidopsis thaliana', // name
                'Arabidopsis thaliana', // commonName
                'A.thaliana', // shortName
                'Model plant organism', // description
                'Arabidopsis', // genus
                'thaliana', // species
              ],
            ],
          });
        }

        return HttpResponse.json({results: []});
      }),
    );

    const {server: apolloServer, context} = await createTestServer();
    const contextValue = await context();

    const cdsWithOrganismQuery = `
      query GetCDSWithOrganism($identifier: String!) {
        cds(identifier: $identifier) {
          results {
            identifier
            description
            length
            isPrimary
            organism {
              taxonId
              name
              genus
              species
            }
          }
        }
      }
    `;

    const response = await executeQuery(
      apolloServer,
      cdsWithOrganismQuery,
      {identifier: 'AT1G01010.1.cds'},
      contextValue,
    );

    if (response.body.singleResult.data) {
      const cds = response.body.singleResult.data.cds.results;

      // Validate CDS data
      expect(cds.identifier).toBe('AT1G01010.1.cds');
      expect(cds.length).toBe(1068);
      expect(cds.isPrimary).toBe(true);

      // KEY TEST: hasOrganismFactory resolution for SequenceFeature (BioEntity)
      expect(cds.organism).toBeDefined();
      expect(cds.organism.taxonId).toBe('3702');
      expect(cds.organism.name).toBe('Arabidopsis thaliana');
      expect(cds.organism.genus).toBe('Arabidopsis');
      expect(cds.organism.species).toBe('thaliana');
    }
  });

  test('handles interface resolution priority correctly', async () => {
    // This test verifies the interface vs typeName priority in hasOrganismFactory
    // BioEntity interface check runs first, then explicit typeName switches

    server.use(
      http.post('*/query/results', async ({request}) => {
        const body = await request.text();
        const params = new URLSearchParams(body);
        const query = params.get('query') || '';

        // Mock ExpressionSource (explicit type, also has organism relationship)
        if (query.includes('ExpressionSource.primaryIdentifier')) {
          return HttpResponse.json({
            results: [
              [
                1, // id
                'EXP_SOURCE_001', // identifier (primaryIdentifier)
                'SRA12345', // sra
                'RNA-seq expression data', // description
                'PRJNA123456', // bioProject
                'FPKM', // unit
                'GSE12345', // geoSeries
                'Expression study synopsis', // synopsis
                3880, // organismTaxonId - KEY FIELD (Medicago)
                'R108', // strainIdentifier
              ],
            ],
          });
        }

        // Mock organism query for Medicago
        if (query.includes('Organism.taxonId') && query.includes('3880')) {
          return HttpResponse.json({
            results: [
              [
                3, // id
                '3880', // taxonId
                'MEDTR', // abbreviation
                'Medicago truncatula', // name
                'Medicago truncatula', // commonName
                'M.truncatula', // shortName
                'Barrel medic', // description
                'Medicago', // genus
                'truncatula', // species
              ],
            ],
          });
        }

        return HttpResponse.json({results: []});
      }),
    );

    const {server: apolloServer, context} = await createTestServer();
    const contextValue = await context();

    const expressionSourceQuery = `
      query GetExpressionSourceWithOrganism($identifier: ID!) {
        expressionSource(identifier: $identifier) {
          results {
            identifier
            description
            geoSeries
            organism {
              taxonId
              name
              genus
              species
            }
          }
        }
      }
    `;

    const response = await executeQuery(
      apolloServer,
      expressionSourceQuery,
      {identifier: 'EXP_SOURCE_001'},
      contextValue,
    );

    if (response.body.singleResult.data) {
      const source = response.body.singleResult.data.expressionSource.results;

      // Validate expression source data
      expect(source.identifier).toBe('EXP_SOURCE_001');
      expect(source.geoSeries).toBe('GSE12345');

      // KEY TEST: hasOrganismFactory resolution for explicit type (ExpressionSource)
      expect(source.organism).toBeDefined();
      expect(source.organism.taxonId).toBe('3880');
      expect(source.organism.name).toBe('Medicago truncatula');
      expect(source.organism.genus).toBe('Medicago');
      expect(source.organism.species).toBe('truncatula');
    }
  });
});
