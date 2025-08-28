import {expect} from 'vitest';

/**
 * Shared validation helpers for biological entity data
 * Reduces duplication across single entity and search tests
 */

export interface BiologicalConstraints {
  // Organism constraints
  validateTaxonomyId?: boolean;
  validateBinomialNomenclature?: boolean;

  // Gene constraints
  validateGeneIdentifier?: boolean;
  validateGeneLength?: boolean;

  // Protein constraints
  validateProteinIdentifier?: boolean;
  validateMolecularWeight?: boolean;
  validateProteinLength?: boolean;
  validateMD5Checksum?: boolean;

  // Sequence constraints
  validateSequenceLength?: boolean;
}

/**
 * Validate organism data structure and biological constraints
 */
export function validateOrganismData(
  organism: any,
  constraints: BiologicalConstraints = {},
) {
  // Basic field validation
  expect(organism.taxonId).toBeDefined();
  expect(organism.name).toBeDefined();
  expect(organism.genus).toBeDefined();
  expect(organism.species).toBeDefined();
  expect(organism.abbreviation).toBeDefined();

  // Data type validation
  expect(typeof organism.taxonId).toBe('string');
  expect(typeof organism.name).toBe('string');
  expect(typeof organism.genus).toBe('string');
  expect(typeof organism.species).toBe('string');
  expect(typeof organism.abbreviation).toBe('string');

  // Biological constraints
  if (constraints.validateTaxonomyId) {
    // NCBI taxonomy IDs are numeric strings
    expect(organism.taxonId).toMatch(/^\d+$/);
  }

  if (constraints.validateBinomialNomenclature) {
    // Species name should follow "Genus species" format
    const expectedFullName = `${organism.genus} ${organism.species}`;
    expect(organism.name).toContain(expectedFullName);

    // Genus should be capitalized
    expect(organism.genus).toMatch(/^[A-Z][a-z]+$/);

    // Species should be lowercase
    expect(organism.species).toMatch(/^[a-z]+$/);
  }
}

/**
 * Validate gene data structure and biological constraints
 */
export function validateGeneData(
  gene: any,
  constraints: BiologicalConstraints = {},
) {
  // Basic field validation
  expect(gene.identifier).toBeDefined();
  expect(gene.symbol).toBeDefined();
  expect(gene.description).toBeDefined();

  // Data type validation
  expect(typeof gene.identifier).toBe('string');
  expect(typeof gene.symbol).toBe('string');
  expect(typeof gene.description).toBe('string');

  // Biological constraints
  if (constraints.validateGeneIdentifier) {
    // Arabidopsis gene identifier format: AT[1-5]G[0-9]{5}
    expect(gene.identifier).toMatch(/^AT[1-5]G\d{5}$/);
  }

  if (constraints.validateGeneLength && gene.length !== undefined) {
    expect(typeof gene.length).toBe('number');
    expect(gene.length).toBeGreaterThan(0);
    expect(gene.length).toBeLessThan(1000000); // Reasonable upper bound
  }
}

/**
 * Validate protein data structure and biological constraints
 */
export function validateProteinData(
  protein: any,
  constraints: BiologicalConstraints = {},
) {
  // Basic field validation
  expect(protein.identifier).toBeDefined();
  expect(protein.name).toBeDefined();
  expect(protein.length).toBeDefined();

  // Data type validation
  expect(typeof protein.identifier).toBe('string');
  expect(typeof protein.name).toBe('string');
  expect(typeof protein.length).toBe('number');

  // Biological constraints
  if (constraints.validateProteinIdentifier) {
    // Arabidopsis protein identifier format: AT[1-5]G[0-9]{5}.[0-9]+
    expect(protein.identifier).toMatch(/^AT[1-5]G\d{5}\.\d+$/);
  }

  if (constraints.validateProteinLength) {
    expect(protein.length).toBeGreaterThan(10); // Minimum realistic protein length
    expect(protein.length).toBeLessThan(50000); // Maximum realistic protein length
  }

  if (
    constraints.validateMolecularWeight &&
    protein.molecularWeight !== undefined
  ) {
    expect(typeof protein.molecularWeight).toBe('number');
    expect(protein.molecularWeight).toBeGreaterThan(1000); // Minimum reasonable weight
    expect(protein.molecularWeight).toBeLessThan(5000000); // Maximum reasonable weight

    // Validate molecular weight vs length correlation
    const avgAAWeight = 110; // Average amino acid molecular weight in Daltons
    const expectedWeight = protein.length * avgAAWeight;
    const tolerance = 0.5; // 50% tolerance

    expect(protein.molecularWeight).toBeGreaterThan(
      expectedWeight * (1 - tolerance),
    );
    expect(protein.molecularWeight).toBeLessThan(
      expectedWeight * (1 + tolerance),
    );
  }

  if (constraints.validateMD5Checksum && protein.md5checksum !== undefined) {
    // MD5 checksums should be 32 hexadecimal characters
    expect(protein.md5checksum).toMatch(/^[a-fA-F0-9]{32}$/);
  }
}

/**
 * Validate gene-organism relationship consistency
 */
export function validateGeneOrganismRelationship(gene: any, organism: any) {
  expect(gene.organism).toBeDefined();
  expect(gene.organism.taxonId).toBe(organism.taxonId);
  expect(gene.organism.name).toBe(organism.name);
  expect(gene.organism.genus).toBe(organism.genus);
  expect(gene.organism.species).toBe(organism.species);
}

/**
 * Validate protein-gene relationship consistency
 */
export function validateProteinGeneRelationship(protein: any, gene: any) {
  if (protein.transcript && gene.identifier) {
    // Protein transcript identifier should be related to gene identifier
    const geneId = gene.identifier;
    const transcriptId = protein.transcript.identifier;
    expect(transcriptId).toContain(geneId);
  }
}

/**
 * Validate identifier consistency across related fields
 */
export function validateIdentifierConsistency(entity: any) {
  const {identifier, primaryAccession, secondaryIdentifier} = entity;

  if (primaryAccession) {
    expect(identifier).toBe(primaryAccession);
  }

  if (secondaryIdentifier) {
    expect(identifier).toBe(secondaryIdentifier);
  }
}

/**
 * Validate sequence data if present
 */
export function validateSequenceData(
  sequence: any,
  constraints: BiologicalConstraints = {},
) {
  if (!sequence) return;

  expect(typeof sequence).toBe('object');

  if (sequence.residues) {
    expect(typeof sequence.residues).toBe('string');
    expect(sequence.residues.length).toBeGreaterThan(0);
  }

  if (sequence.length) {
    expect(typeof sequence.length).toBe('number');
    expect(sequence.length).toBeGreaterThan(0);
  }

  if (sequence.md5checksum) {
    expect(sequence.md5checksum).toMatch(/^[a-fA-F0-9]{32}$/);
  }

  if (
    constraints.validateSequenceLength &&
    sequence.residues &&
    sequence.length
  ) {
    // Sequence length should match residues length
    expect(sequence.length).toBe(sequence.residues.length);
  }
}

/**
 * Validate comprehensive entity with all relationships
 */
export function validateEntityWithRelationships(
  entity: any,
  entityType: 'gene' | 'protein' | 'organism',
  constraints: BiologicalConstraints = {},
) {
  switch (entityType) {
    case 'organism':
      validateOrganismData(entity, constraints);
      break;

    case 'gene':
      validateGeneData(entity, constraints);

      if (entity.organism) {
        validateOrganismData(entity.organism, constraints);
        validateGeneOrganismRelationship(entity, entity.organism);
      }

      if (entity.strain) {
        expect(entity.strain.identifier).toBeDefined();
        expect(typeof entity.strain.identifier).toBe('string');
      }

      if (entity.chromosome) {
        expect(entity.chromosome.identifier).toBeDefined();
        expect(typeof entity.chromosome.identifier).toBe('string');
      }
      break;

    case 'protein':
      validateProteinData(entity, constraints);

      if (entity.organism) {
        validateOrganismData(entity.organism, constraints);
      }

      if (entity.sequence) {
        validateSequenceData(entity.sequence, constraints);
      }

      if (entity.transcript) {
        expect(entity.transcript.identifier).toBeDefined();
        expect(typeof entity.transcript.identifier).toBe('string');
      }

      validateIdentifierConsistency(entity);
      break;
  }
}

/**
 * Default biological constraint configurations
 */
export const STRICT_BIOLOGICAL_CONSTRAINTS: BiologicalConstraints = {
  validateTaxonomyId: true,
  validateBinomialNomenclature: true,
  validateGeneIdentifier: true,
  validateGeneLength: true,
  validateProteinIdentifier: true,
  validateMolecularWeight: true,
  validateProteinLength: true,
  validateMD5Checksum: true,
  validateSequenceLength: true,
};

export const RELAXED_BIOLOGICAL_CONSTRAINTS: BiologicalConstraints = {
  validateTaxonomyId: false,
  validateBinomialNomenclature: true,
  validateGeneIdentifier: true,
  validateGeneLength: false,
  validateProteinIdentifier: true,
  validateMolecularWeight: false,
  validateProteinLength: true,
  validateMD5Checksum: false,
  validateSequenceLength: false,
};
