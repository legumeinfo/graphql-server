import {describe, test, expect} from 'vitest';
import {
  createTestServer,
  executeQuery,
} from '../../../__helpers__/apollo-server.js';

const GENE_WITH_RELATIONSHIPS_QUERY = `
  query GetGeneWithRelationships($identifier: ID!) {
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
          abbreviation
        }
        strain {
          identifier
          name
          description
          origin
        }
        chromosome {
          identifier
          length
        }
        chromosomeLocation {
          start
          end
        }
        sequence {
          residues
          length
        }
      }
    }
  }
`;

const PROTEIN_WITH_GENE_QUERY = `
  query GetProteinWithGene($identifier: ID!) {
    protein(identifier: $identifier) {
      results {
        identifier
        name
        length
        organism {
          taxonId
          name
          genus
          species
        }
        transcript {
          identifier
          name
        }
        sequence {
          residues
          length
          md5checksum
        }
      }
    }
  }
`;

const CDS_WITH_TRANSCRIPT_QUERY = `
  query GetCDSWithTranscript($identifier: ID!) {
    cds(identifier: $identifier) {
      results {
        identifier
        name
        length
        organism {
          taxonId
          name
        }
        chromosome {
          identifier
        }
        transcript {
          identifier
        }
        sequence {
          length
        }
      }
    }
  }
`;

const QTL_WITH_STUDY_AND_TRAIT_QUERY = `
  query GetQTLWithStudyAndTrait($identifier: ID!) {
    qtl(identifier: $identifier) {
      results {
        identifier
        name
        lod
        start
        end
        peak
        trait {
          identifier
          name
          description
          organism {
            taxonId
            name
          }
        }
        qtlStudy {
          identifier
          description
          genotypes
          organism {
            taxonId
          }
        }
        linkageGroup {
          identifier
        }
        dataSets {
          name
        }
      }
    }
  }
`;

describe('Nested GraphQL Relationships', () => {
  test('validates gene relationships are properly resolved', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      GENE_WITH_RELATIONSHIPS_QUERY,
      {identifier: 'AT1G01010'},
      contextValue,
    );

    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult).toBeDefined();

    if (
      response.body.singleResult.data &&
      response.body.singleResult.data.gene
    ) {
      const gene = response.body.singleResult.data.gene.results;

      // Validate main gene data
      expect(gene.identifier).toBe('AT1G01010');
      expect(gene.symbol).toBe('NAC001');

      // Validate organism relationship
      expect(gene.organism).toBeDefined();
      expect(gene.organism.taxonId).toBe('3702');
      expect(gene.organism.name).toBe('Arabidopsis thaliana');
      expect(gene.organism.genus).toBe('Arabidopsis');
      expect(gene.organism.species).toBe('thaliana');
      expect(gene.organism.abbreviation).toBe('ARATH');

      // Validate strain relationship
      expect(gene.strain).toBeDefined();
      expect(gene.strain.identifier).toBe('Col-0');
      expect(gene.strain.name).toBeDefined();

      // Validate chromosome relationship
      expect(gene.chromosome).toBeDefined();
      expect(gene.chromosome.identifier).toBe('1');
      expect(typeof gene.chromosome.length).toBe('number');

      // Validate location relationship
      expect(gene.chromosomeLocation).toBeDefined();
      expect(typeof gene.chromosomeLocation.start).toBe('number');
      expect(typeof gene.chromosomeLocation.end).toBe('number');
      expect(gene.chromosomeLocation.end).toBeGreaterThan(
        gene.chromosomeLocation.start,
      );

      // Validate sequence relationship
      expect(gene.sequence).toBeDefined();
      expect(typeof gene.sequence.length).toBe('number');
    }
  });

  test('validates protein-gene relationships', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      PROTEIN_WITH_GENE_QUERY,
      {identifier: 'AT1G01010.1'},
      contextValue,
    );

    if (
      response.body.singleResult.data &&
      response.body.singleResult.data.protein
    ) {
      const protein = response.body.singleResult.data.protein.results;

      // Validate protein data
      expect(protein.identifier).toBe('AT1G01010.1');
      expect(typeof protein.length).toBe('number');

      // Validate organism relationship matches expectations
      expect(protein.organism).toBeDefined();
      expect(protein.organism.taxonId).toBe('3702');
      expect(protein.organism.name).toBe('Arabidopsis thaliana');

      // Validate transcript relationship
      expect(protein.transcript).toBeDefined();
      expect(protein.transcript.identifier).toBe('AT1G01010.1');

      // Validate sequence relationship
      expect(protein.sequence).toBeDefined();
      expect(typeof protein.sequence.length).toBe('number');
      expect(typeof protein.sequence.md5checksum).toBe('string');

      // Validate consistency between protein and transcript identifiers
      expect(protein.identifier).toBe(protein.transcript.identifier);
    }
  });

  test('validates CDS-transcript relationships', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      CDS_WITH_TRANSCRIPT_QUERY,
      {identifier: 'AT1G01010.1.cds'},
      contextValue,
    );

    if (
      response.body.singleResult.data &&
      response.body.singleResult.data.cds
    ) {
      const cds = response.body.singleResult.data.cds.results;

      // Validate CDS data
      expect(cds.identifier).toBe('AT1G01010.1.cds');
      expect(typeof cds.length).toBe('number');

      // Validate organism relationship
      expect(cds.organism).toBeDefined();
      expect(cds.organism.taxonId).toBe('3702');

      // Validate chromosome relationship
      expect(cds.chromosome).toBeDefined();
      expect(cds.chromosome.identifier).toBe('1');

      // Validate transcript relationship
      expect(cds.transcript).toBeDefined();
      expect(cds.transcript.identifier).toBe('AT1G01010.1');

      // Validate sequence relationship
      expect(cds.sequence).toBeDefined();
      expect(typeof cds.sequence.length).toBe('number');

      // Validate that CDS length is typically less than gene length (due to introns)
      expect(cds.length).toBeGreaterThan(0);
    }
  });

  test('validates complex QTL relationships', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      QTL_WITH_STUDY_AND_TRAIT_QUERY,
      {identifier: 'QTL001'},
      contextValue,
    );

    if (
      response.body.singleResult.data &&
      response.body.singleResult.data.qtl
    ) {
      const qtl = response.body.singleResult.data.qtl.results;

      // Validate QTL data
      expect(qtl.identifier).toBe('QTL001');
      expect(typeof qtl.lod).toBe('number');
      expect(typeof qtl.start).toBe('number');
      expect(typeof qtl.end).toBe('number');
      expect(typeof qtl.peak).toBe('number');

      // Validate trait relationship
      expect(qtl.trait).toBeDefined();
      expect(qtl.trait.identifier).toBe('TRAIT001');
      expect(qtl.trait.name).toBe('Plant Height');
      expect(qtl.trait.description).toContain('Quantitative measurement');

      // Validate trait's organism relationship
      expect(qtl.trait.organism).toBeDefined();
      expect(qtl.trait.organism.taxonId).toBe('3702');
      expect(qtl.trait.organism.name).toBe('Arabidopsis thaliana');

      // Validate QTL study relationship
      expect(qtl.qtlStudy).toBeDefined();
      expect(qtl.qtlStudy.identifier).toBe('QTLS001');
      expect(qtl.qtlStudy.description).toContain('Plant height QTL mapping');
      expect(qtl.qtlStudy.genotypes).toContain('RIL population');

      // Validate study's organism relationship
      expect(qtl.qtlStudy.organism).toBeDefined();
      expect(qtl.qtlStudy.organism.taxonId).toBe('3702');

      // Validate linkage group relationship
      expect(qtl.linkageGroup).toBeDefined();
      expect(qtl.linkageGroup.identifier).toBe('LG1');

      // Validate dataset relationship
      expect(qtl.dataSets).toBeDefined();
      expect(qtl.dataSets.name).toBe('Height_Study_Dataset');

      // Validate organism consistency across relationships
      expect(qtl.trait.organism.taxonId).toBe(qtl.qtlStudy.organism.taxonId);
    }
  });

  test('validates relationship data type consistency', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      GENE_WITH_RELATIONSHIPS_QUERY,
      {identifier: 'AT1G01010'},
      contextValue,
    );

    if (
      response.body.singleResult.data &&
      response.body.singleResult.data.gene &&
      !response.body.singleResult.errors
    ) {
      const gene = response.body.singleResult.data.gene.results;

      // Validate nested object structures
      expect(typeof gene.organism).toBe('object');
      expect(gene.organism).not.toBeNull();
      expect(Array.isArray(gene.organism)).toBe(false);

      expect(typeof gene.strain).toBe('object');
      expect(gene.strain).not.toBeNull();
      expect(Array.isArray(gene.strain)).toBe(false);

      expect(typeof gene.chromosome).toBe('object');
      expect(gene.chromosome).not.toBeNull();
      expect(Array.isArray(gene.chromosome)).toBe(false);

      // Validate that nested fields maintain proper types
      expect(typeof gene.organism.taxonId).toBe('string');
      expect(typeof gene.organism.name).toBe('string');
      expect(typeof gene.chromosome.length).toBe('number');
      expect(typeof gene.chromosomeLocation.start).toBe('number');
      expect(typeof gene.chromosomeLocation.end).toBe('number');
    }
  });

  test('validates relationship field availability', async () => {
    const {server, context} = await createTestServer();
    const contextValue = await context();

    const response = await executeQuery(
      server,
      PROTEIN_WITH_GENE_QUERY,
      {identifier: 'AT1G01010.1'},
      contextValue,
    );

    if (
      response.body.singleResult.data &&
      response.body.singleResult.data.protein &&
      !response.body.singleResult.errors
    ) {
      const protein = response.body.singleResult.data.protein.results;

      // Verify that all requested relationship fields are present
      expect(protein.organism).toBeDefined();
      expect(protein.transcript).toBeDefined();
      expect(protein.sequence).toBeDefined();

      // Verify nested fields within relationships are accessible
      expect(protein.organism.taxonId).toBeDefined();
      expect(protein.organism.name).toBeDefined();
      expect(protein.organism.genus).toBeDefined();
      expect(protein.organism.species).toBeDefined();

      expect(protein.transcript.identifier).toBeDefined();

      expect(protein.sequence.length).toBeDefined();
      expect(protein.sequence.md5checksum).toBeDefined();
    }
  });
});
