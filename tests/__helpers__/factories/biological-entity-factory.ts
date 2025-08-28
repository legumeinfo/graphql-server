import {faker} from '@faker-js/faker';

/**
 * Factory system for generating consistent biological test data
 * Reduces duplication and provides realistic biological data variations
 */

// Base biological identifier generators
const generateGeneId = () =>
  `AT${faker.number.int({min: 1, max: 5})}G${faker.string.numeric(5)}`;
const generateProteinId = (geneId?: string) =>
  `${geneId || generateGeneId()}.${faker.number.int({min: 1, max: 3})}`;
const generateTaxonId = () =>
  faker.helpers.arrayElement(['3702', '3847', '3880', '4081']); // Common model organisms

// Core entity factories
export const entityFactories = {
  gene: (overrides: any = {}) => ({
    id: faker.number.int({min: 1, max: 10000}),
    primaryIdentifier: overrides.identifier || generateGeneId(),
    description:
      overrides.description ||
      `${faker.science.chemicalElement().name} domain containing protein`,
    symbol:
      overrides.symbol ||
      faker.string.alpha({length: {min: 3, max: 6}}).toUpperCase(),
    name: overrides.name || `${faker.science.chemicalElement().name} protein`,
    assemblyVersion: 'TAIR10',
    annotationVersion: 'v1.0',
    secondaryIdentifier: overrides.identifier || generateGeneId(),
    organism: {taxonId: overrides.taxonId || generateTaxonId()},
    strain: {identifier: overrides.strainId || 'Col-0'},
    score: 0.0,
    scoreType: 'none',
    length: faker.number.int({min: 500, max: 5000}),
    sequenceOntologyTerm: {identifier: 'SO:0000704'}, // gene
    chromosomeLocation: {id: faker.number.int({min: 1, max: 100})},
    supercontigLocation: null,
    sequence: {id: faker.number.int({min: 1, max: 1000})},
    chromosome: {
      primaryIdentifier: faker.helpers.arrayElement(['1', '2', '3', '4', '5']),
    },
    supercontig: null,
    briefDescription: overrides.briefDescription || faker.lorem.words(3),
    ensemblName: overrides.identifier || generateGeneId(),
    ...overrides,
  }),

  organism: (overrides: any = {}) => {
    const taxonId = overrides.taxonId || generateTaxonId();
    const organismData = {
      '3702': {
        genus: 'Arabidopsis',
        species: 'thaliana',
        name: 'Arabidopsis thaliana',
        abbreviation: 'ARATH',
        commonName: 'Arabidopsis thaliana',
      },
      '3847': {
        genus: 'Glycine',
        species: 'max',
        name: 'Glycine max',
        abbreviation: 'GLYCM',
        commonName: 'Glycine max',
      },
      '3880': {
        genus: 'Medicago',
        species: 'truncatula',
        name: 'Medicago truncatula',
        abbreviation: 'MEDTR',
        commonName: 'Medicago truncatula',
      },
      '4081': {
        genus: 'Solanum',
        species: 'tuberosum',
        name: 'Solanum tuberosum',
        abbreviation: 'SOLTU',
        commonName: 'Solanum tuberosum',
      },
    };
    const baseData =
      organismData[taxonId as keyof typeof organismData] ||
      organismData['3702'];

    return {
      id: faker.number.int({min: 1, max: 100}),
      taxonId,
      abbreviation: baseData.abbreviation,
      name: baseData.name,
      commonName: baseData.commonName,
      shortName: `${baseData.genus.charAt(0)}.${baseData.species}`,
      description: `Model organism - ${baseData.name}`,
      genus: baseData.genus,
      species: baseData.species,
      ...overrides,
    };
  },

  protein: (overrides: any = {}) => ({
    id: faker.number.int({min: 1, max: 10000}),
    primaryIdentifier: overrides.identifier || generateProteinId(),
    description:
      overrides.description ||
      `${faker.science.chemicalElement().name} domain containing protein`,
    symbol:
      overrides.symbol ||
      faker.string.alpha({length: {min: 3, max: 6}}).toUpperCase(),
    name: overrides.name || `${faker.science.chemicalElement().name} protein`,
    assemblyVersion: 'TAIR10',
    annotationVersion: 'v1.0',
    secondaryIdentifier: overrides.identifier || generateProteinId(),
    organism: {taxonId: overrides.taxonId || generateTaxonId()},
    strain: {identifier: overrides.strainId || 'Col-0'},
    md5checksum: faker.string.alphanumeric(16),
    primaryAccession: overrides.identifier || generateProteinId(),
    molecularWeight: faker.number.int({min: 10000, max: 100000}),
    length: faker.number.int({min: 100, max: 1000}),
    isPrimary: overrides.isPrimary !== undefined ? overrides.isPrimary : true,
    phylonode: {identifier: `phylo${faker.number.int({min: 1, max: 100})}`},
    transcript: {
      primaryIdentifier: overrides.transcriptId || generateProteinId(),
    },
    sequence: {id: faker.number.int({min: 1, max: 1000})},
    ...overrides,
  }),

  qtl: (overrides: any = {}) => ({
    id: faker.number.int({min: 1, max: 1000}),
    primaryIdentifier: overrides.identifier || `QTL${faker.string.numeric(3)}`,
    name:
      overrides.name ||
      `${faker.helpers.arrayElement(['Height', 'Weight', 'Yield', 'Resistance'])} QTL`,
    lod:
      overrides.lod ||
      faker.number.float({min: 2.0, max: 15.0, precision: 0.1}),
    likelihoodRatio:
      overrides.likelihoodRatio ||
      faker.number.float({min: 5.0, max: 50.0, precision: 0.1}),
    end: overrides.end || faker.number.int({min: 1000000, max: 2000000}),
    markerR2:
      overrides.markerR2 ||
      faker.number.float({min: 0.05, max: 0.8, precision: 0.01}),
    start: overrides.start || faker.number.int({min: 500000, max: 1500000}),
    peak: overrides.peak || faker.number.int({min: 750000, max: 1750000}),
    trait: {
      primaryIdentifier: overrides.traitId || `TRAIT${faker.string.numeric(3)}`,
    },
    qtlStudy: {
      primaryIdentifier: overrides.studyId || `QTLS${faker.string.numeric(3)}`,
    },
    linkageGroup: {
      primaryIdentifier:
        overrides.linkageGroup || `LG${faker.number.int({min: 1, max: 20})}`,
    },
    dataSets: {name: overrides.dataSet || 'QTL_Study_Dataset'},
    traitName:
      overrides.traitName ||
      faker.helpers.arrayElement([
        'Plant Height',
        'Seed Weight',
        'Flowering Time',
      ]),
    markerNames:
      overrides.markerNames ||
      `M${faker.number.int({min: 1, max: 100})},M${faker.number.int({min: 101, max: 200})}`,
    ...overrides,
  }),

  strain: (overrides: any = {}) => ({
    identifier:
      overrides.identifier ||
      faker.helpers.arrayElement(['Col-0', 'Ler-0', 'Ws-0', 'C24']),
    name:
      overrides.name ||
      faker.helpers.arrayElement([
        'Columbia-0',
        'Landsberg erecta',
        'Wassilewskija',
        'C24',
      ]),
    description:
      overrides.description ||
      faker.helpers.arrayElement([
        'Reference strain',
        'Natural variant',
        'Laboratory strain',
      ]),
    origin:
      overrides.origin ||
      faker.helpers.arrayElement([
        'Laboratory collection',
        'Wild collection',
        'Seed bank',
      ]),
    ...overrides,
  }),

  cds: (overrides: any = {}) => ({
    id: faker.number.int({min: 1, max: 10000}),
    primaryIdentifier: overrides.identifier || `${generateGeneId()}.1.cds`,
    description: overrides.description || 'Coding sequence',
    symbol:
      overrides.symbol ||
      faker.string.alpha({length: {min: 3, max: 6}}).toUpperCase() + '_CDS',
    name: overrides.name || 'Coding sequence',
    assemblyVersion: 'TAIR10',
    annotationVersion: 'v1.0',
    secondaryIdentifier: overrides.identifier || `${generateGeneId()}.1.cds`,
    organism: {taxonId: overrides.taxonId || generateTaxonId()},
    strain: {identifier: overrides.strainId || 'Col-0'},
    score: 0.0,
    scoreType: 'none',
    length: faker.number.int({min: 300, max: 3000}),
    sequenceOntologyTerm: {identifier: 'SO:0000316'}, // CDS
    chromosomeLocation: {id: faker.number.int({min: 1, max: 100})},
    supercontigLocation: null,
    sequence: {id: faker.number.int({min: 1, max: 1000})},
    chromosome: {
      primaryIdentifier: faker.helpers.arrayElement(['1', '2', '3', '4', '5']),
    },
    supercontig: null,
    transcript: {
      primaryIdentifier: overrides.transcriptId || generateProteinId(),
    },
    isPrimary: overrides.isPrimary !== undefined ? overrides.isPrimary : true,
    ...overrides,
  }),

  // Add more entities as needed
  exon: (overrides: any = {}) => ({
    id: faker.number.int({min: 1, max: 10000}),
    primaryIdentifier:
      overrides.identifier ||
      `${generateGeneId()}.1.exon${faker.number.int({min: 1, max: 10})}`,
    description:
      overrides.description || `Exon ${faker.number.int({min: 1, max: 10})}`,
    symbol:
      overrides.symbol ||
      faker.string.alpha({length: {min: 3, max: 6}}).toUpperCase() + '_EXON',
    name: overrides.name || `Exon ${faker.number.int({min: 1, max: 10})}`,
    assemblyVersion: 'TAIR10',
    annotationVersion: 'v1.0',
    secondaryIdentifier:
      overrides.identifier ||
      `${generateGeneId()}.1.exon${faker.number.int({min: 1, max: 10})}`,
    organism: {taxonId: overrides.taxonId || generateTaxonId()},
    strain: {identifier: overrides.strainId || 'Col-0'},
    score: 0.0,
    scoreType: 'none',
    length: faker.number.int({min: 50, max: 500}),
    sequenceOntologyTerm: {identifier: 'SO:0000147'}, // exon
    chromosomeLocation: {id: faker.number.int({min: 1, max: 100})},
    supercontigLocation: null,
    sequence: {id: faker.number.int({min: 1, max: 1000})},
    chromosome: {
      primaryIdentifier: faker.helpers.arrayElement(['1', '2', '3', '4', '5']),
    },
    supercontig: null,
    ...overrides,
  }),
};

// Factory utility functions
export const createMultipleEntities = <T>(
  entityType: keyof typeof entityFactories,
  count: number,
  baseOverrides: any = {},
): T[] => {
  return Array.from({length: count}, (_, index) =>
    entityFactories[entityType]({
      ...baseOverrides,
      ...(baseOverrides.variations?.[index] || {}),
    }),
  );
};

export const createRelatedEntities = (config: {
  gene?: any;
  protein?: any;
  organism?: any;
}) => {
  const geneId = config.gene?.identifier || generateGeneId();
  const taxonId = config.organism?.taxonId || generateTaxonId();

  return {
    gene: entityFactories.gene({identifier: geneId, taxonId, ...config.gene}),
    protein: entityFactories.protein({
      identifier: generateProteinId(geneId),
      taxonId,
      transcriptId: `${geneId}.1`,
      ...config.protein,
    }),
    organism: entityFactories.organism({taxonId, ...config.organism}),
  };
};

// InterMine response format converters
export const toIntermineArrayFormat = (
  entity: any,
  entityType: string,
): any[] => {
  switch (entityType) {
    case 'gene':
      return [
        entity.id,
        entity.primaryIdentifier,
        entity.description,
        entity.symbol,
        entity.name,
        entity.assemblyVersion,
        entity.annotationVersion,
        entity.secondaryIdentifier,
        entity.organism?.taxonId,
        entity.strain?.identifier,
        entity.score,
        entity.scoreType,
        entity.length,
        entity.sequenceOntologyTerm?.identifier,
        entity.chromosomeLocation?.id,
        entity.supercontigLocation?.id,
        entity.sequence?.id,
        entity.chromosome?.primaryIdentifier,
        entity.supercontig?.primaryIdentifier,
        entity.briefDescription,
        entity.ensemblName,
      ];
    case 'organism':
      return [
        entity.id,
        entity.taxonId,
        entity.abbreviation,
        entity.name,
        entity.commonName,
        entity.shortName,
        entity.description,
        entity.genus,
        entity.species,
      ];
    case 'protein':
      return [
        entity.id,
        entity.primaryIdentifier,
        entity.description,
        entity.symbol,
        entity.name,
        entity.assemblyVersion,
        entity.annotationVersion,
        entity.secondaryIdentifier,
        entity.organism?.taxonId,
        entity.strain?.identifier,
        entity.md5checksum,
        entity.primaryAccession,
        entity.molecularWeight,
        entity.length,
        entity.isPrimary,
        entity.phylonode?.identifier,
        entity.transcript?.primaryIdentifier,
        entity.sequence?.id,
      ];
    case 'qtl':
      return [
        entity.id,
        entity.primaryIdentifier,
        entity.name,
        entity.lod,
        entity.likelihoodRatio,
        entity.end,
        entity.markerR2,
        entity.start,
        entity.peak,
        entity.trait?.primaryIdentifier,
        entity.qtlStudy?.primaryIdentifier,
        entity.linkageGroup?.primaryIdentifier,
        entity.dataSets?.name,
        entity.traitName,
        entity.markerNames,
      ];
    case 'cds':
      return [
        entity.id,
        entity.primaryIdentifier,
        entity.description,
        entity.symbol,
        entity.name,
        entity.assemblyVersion,
        entity.annotationVersion,
        entity.secondaryIdentifier,
        entity.organism?.taxonId,
        entity.strain?.identifier,
        entity.score,
        entity.scoreType,
        entity.length,
        entity.sequenceOntologyTerm?.identifier,
        entity.chromosomeLocation?.id,
        entity.supercontigLocation?.id,
        entity.sequence?.id,
        entity.chromosome?.primaryIdentifier,
        entity.supercontig?.primaryIdentifier,
        entity.transcript?.primaryIdentifier,
        entity.isPrimary,
      ];
    default:
      throw new Error(`Unknown entity type: ${entityType}`);
  }
};
