/**
 * Biological Entity Graph Definition for Relationship Testing
 *
 * This defines a realistic network of biological entities with proper relationships
 * that mirrors real-world data structures for comprehensive relationship testing.
 */

import {MockEntityRegistry} from './entity-registry.js';

/**
 * Initialize the biological test graph with interconnected entities
 */
export function createBiologicalTestGraph(): MockEntityRegistry {
  const registry = new MockEntityRegistry();

  // === Core Organisms ===
  registry.registerEntity(
    'org1',
    'Organism',
    {
      id: 1,
      taxonId: '3702',
      abbreviation: 'ARATH',
      name: 'Arabidopsis thaliana',
      commonName: 'Arabidopsis thaliana',
      shortName: 'A.thaliana',
      description: 'Model plant organism',
      genus: 'Arabidopsis',
      species: 'thaliana',
    },
    {
      strains: ['strain1'],
      chromosomes: ['chr1'],
      genes: ['gene1', 'gene2'],
      proteins: ['protein1', 'protein2'],
      traits: ['trait1'],
      qtlStudies: ['qtlstudy1'],
    },
  );

  registry.registerEntity('org2', 'Organism', {
    id: 2,
    taxonId: '3847',
    abbreviation: 'GLYCM',
    name: 'Glycine max',
    commonName: 'Glycine max',
    shortName: 'G.max',
    description: 'Soybean',
    genus: 'Glycine',
    species: 'max',
  });

  // === Strains ===
  registry.registerEntity(
    'strain1',
    'Strain',
    {
      identifier: 'Col-0',
      name: 'Col-0',
      description: 'Reference strain for Arabidopsis thaliana',
      origin: 'Laboratory collection',
    },
    {
      organism: ['org1'],
      genes: ['gene1', 'gene2'],
      proteins: ['protein1', 'protein2'],
    },
  );

  // === Chromosomes ===
  registry.registerEntity(
    'chr1',
    'Chromosome',
    {
      id: 1,
      primaryIdentifier: '1',
      description: 'Chromosome 1',
      symbol: '1',
      name: 'Chromosome 1',
      assemblyVersion: 'TAIR10',
      annotationVersion: 'v1.0',
      secondaryIdentifier: '1',
      length: 30427671,
      scoreType: 'none',
      score: 0.0,
    },
    {
      organism: ['org1'],
      strain: ['strain1'],
      genes: ['gene1', 'gene2'],
      locations: ['loc1', 'loc2'],
      sequenceOntologyTerm: ['so_chr'],
    },
  );

  // === Genes ===
  registry.registerEntity(
    'gene1',
    'Gene',
    {
      id: 1,
      primaryIdentifier: 'AT1G01010',
      description: 'NAC domain containing protein 1',
      symbol: 'NAC001',
      name: 'NAC domain containing protein 1',
      assemblyVersion: 'TAIR10',
      annotationVersion: 'v1.0',
      secondaryIdentifier: 'AT1G01010',
      length: 2268,
      score: 0.0,
      scoreType: 'none',
      briefDescription: 'NAC domain protein',
      ensemblName: 'AT1G01010',
    },
    {
      organism: ['org1'],
      strain: ['strain1'],
      chromosome: ['chr1'],
      chromosomeLocation: ['loc1'],
      sequence: ['seq1'],
      sequenceOntologyTerm: ['so_gene'],
      transcripts: ['transcript1'],
      proteins: ['protein1'],
      cds: ['cds1'],
      exons: ['exon1'],
      utrs: ['utr1'],
    },
  );

  registry.registerEntity(
    'gene2',
    'Gene',
    {
      id: 2,
      primaryIdentifier: 'AT1G01020',
      description: 'ARV1 family protein',
      symbol: 'ARV1',
      name: 'ARV1 family protein',
      assemblyVersion: 'TAIR10',
      annotationVersion: 'v1.0',
      secondaryIdentifier: 'AT1G01020',
      length: 1560,
      score: 0.0,
      scoreType: 'none',
      briefDescription: 'ARV1 protein',
      ensemblName: 'AT1G01020',
    },
    {
      organism: ['org1'],
      strain: ['strain1'],
      chromosome: ['chr1'],
      chromosomeLocation: ['loc2'],
      sequence: ['seq2'],
      sequenceOntologyTerm: ['so_gene'],
      transcripts: ['transcript2'],
      proteins: ['protein2'],
    },
  );

  // === Transcripts ===
  registry.registerEntity(
    'transcript1',
    'Transcript',
    {
      id: 1,
      primaryIdentifier: 'AT1G01010.1',
      description: 'NAC001 transcript',
      symbol: 'NAC001',
      name: 'NAC001 transcript',
      assemblyVersion: 'TAIR10',
      annotationVersion: 'v1.0',
      secondaryIdentifier: 'AT1G01010.1',
      length: 1068,
      score: 0.0,
      scoreType: 'none',
    },
    {
      organism: ['org1'],
      strain: ['strain1'],
      gene: ['gene1'],
      protein: ['protein1'],
      chromosome: ['chr1'],
      sequence: ['seq3'],
      sequenceOntologyTerm: ['so_transcript'],
    },
  );

  registry.registerEntity(
    'transcript2',
    'Transcript',
    {
      id: 2,
      primaryIdentifier: 'AT1G01020.1',
      description: 'ARV1 transcript',
      symbol: 'ARV1',
      name: 'ARV1 transcript',
      assemblyVersion: 'TAIR10',
      annotationVersion: 'v1.0',
      secondaryIdentifier: 'AT1G01020.1',
      length: 800,
      score: 0.0,
      scoreType: 'none',
    },
    {
      organism: ['org1'],
      strain: ['strain1'],
      gene: ['gene2'],
      protein: ['protein2'],
      chromosome: ['chr1'],
      sequence: ['seq4'],
    },
  );

  // === Proteins ===
  registry.registerEntity(
    'protein1',
    'Protein',
    {
      id: 1,
      primaryIdentifier: 'AT1G01010.1',
      description: 'NAC domain containing protein 1',
      symbol: 'NAC001',
      name: 'NAC domain containing protein 1',
      assemblyVersion: 'TAIR10',
      annotationVersion: 'v1.0',
      secondaryIdentifier: 'AT1G01010.1',
      md5checksum: 'abcd1234efgh5678',
      primaryAccession: 'AT1G01010.1',
      molecularWeight: 39654,
      length: 356,
      isPrimary: true,
    },
    {
      organism: ['org1'],
      strain: ['strain1'],
      gene: ['gene1'],
      transcript: ['transcript1'],
      sequence: ['seq5'],
      phylonode: ['phylo1'],
    },
  );

  registry.registerEntity(
    'protein2',
    'Protein',
    {
      id: 2,
      primaryIdentifier: 'AT1G01020.1',
      description: 'ARV1 family protein',
      symbol: 'ARV1',
      name: 'ARV1 family protein',
      assemblyVersion: 'TAIR10',
      annotationVersion: 'v1.0',
      secondaryIdentifier: 'AT1G01020.1',
      md5checksum: 'efgh5678ijkl9012',
      primaryAccession: 'AT1G01020.1',
      molecularWeight: 21876,
      length: 197,
      isPrimary: true,
    },
    {
      organism: ['org1'],
      strain: ['strain1'],
      gene: ['gene2'],
      transcript: ['transcript2'],
      sequence: ['seq6'],
      phylonode: ['phylo2'],
    },
  );

  // === Sequences ===
  registry.registerEntity('seq1', 'Sequence', {
    id: 1,
    md5checksum: 'gene1_checksum',
    residues: 'ATGCGTAACGTACGTACGTAACGTACGTACGT...', // Gene sequence
    length: 2268,
  });

  registry.registerEntity('seq2', 'Sequence', {
    id: 2,
    md5checksum: 'gene2_checksum',
    residues: 'ATGGCAACTGCAACTGCAACTGCAACTGCA...', // Gene2 sequence
    length: 1560,
  });

  registry.registerEntity('seq3', 'Sequence', {
    id: 3,
    md5checksum: 'transcript1_checksum',
    residues: 'ATGCGTAACGTACGTACGTAACGTACGT...', // Transcript sequence
    length: 1068,
  });

  registry.registerEntity('seq4', 'Sequence', {
    id: 4,
    md5checksum: 'transcript2_checksum',
    residues: 'ATGGCAACTGCAACTGCAACTGCAACT...', // Transcript2 sequence
    length: 800,
  });

  registry.registerEntity('seq5', 'Sequence', {
    id: 5,
    md5checksum: 'abcd1234efgh5678',
    residues: 'MGRTRTRTRTRT...', // Protein sequence (amino acids)
    length: 356,
  });

  registry.registerEntity('seq6', 'Sequence', {
    id: 6,
    md5checksum: 'efgh5678ijkl9012',
    residues: 'MATATATATATAT...', // Protein2 sequence (amino acids)
    length: 197,
  });

  // === Locations ===
  registry.registerEntity(
    'loc1',
    'Location',
    {
      id: 1,
      start: 1,
      end: 2268,
      strand: '+',
    },
    {
      feature: ['gene1'],
      locatedOn: ['chr1'],
    },
  );

  registry.registerEntity(
    'loc2',
    'Location',
    {
      id: 2,
      start: 5000,
      end: 6560,
      strand: '+',
    },
    {
      feature: ['gene2'],
      locatedOn: ['chr1'],
    },
  );

  // === Sequence Ontology Terms ===
  registry.registerEntity('so_gene', 'SequenceOntologyTerm', {
    id: 1,
    identifier: 'SO:0000704',
    name: 'gene',
    description:
      'A region (or regions) that includes all of the sequence elements necessary to encode a functional transcript.',
  });

  registry.registerEntity('so_transcript', 'SequenceOntologyTerm', {
    id: 2,
    identifier: 'SO:0000673',
    name: 'transcript',
    description:
      'An RNA synthesized on a DNA or RNA template by an RNA polymerase.',
  });

  registry.registerEntity('so_chr', 'SequenceOntologyTerm', {
    id: 3,
    identifier: 'SO:0000340',
    name: 'chromosome',
    description:
      'A structure composed of a very long molecule of DNA and associated proteins that carries hereditary information.',
  });

  // === CDS ===
  registry.registerEntity(
    'cds1',
    'CDS',
    {
      id: 1,
      primaryIdentifier: 'AT1G01010.1.cds',
      description: 'Coding sequence for NAC domain protein',
      symbol: 'NAC001_CDS',
      name: 'NAC domain protein CDS',
      assemblyVersion: 'TAIR10',
      annotationVersion: 'v1.0',
      secondaryIdentifier: 'AT1G01010.1.cds',
      length: 1068,
      score: 0.0,
      scoreType: 'none',
      isPrimary: true,
    },
    {
      organism: ['org1'],
      strain: ['strain1'],
      gene: ['gene1'],
      transcript: ['transcript1'],
      chromosome: ['chr1'],
      sequence: ['seq3'],
      sequenceOntologyTerm: ['so_cds'],
    },
  );

  registry.registerEntity('so_cds', 'SequenceOntologyTerm', {
    id: 4,
    identifier: 'SO:0000316',
    name: 'CDS',
    description:
      'A contiguous sequence which begins with, and includes, a start codon and ends with, and includes, a stop codon.',
  });

  // === Phylonodes ===
  registry.registerEntity('phylo1', 'Phylonode', {
    id: 1,
    identifier: 'phylo1',
    isRoot: false,
    length: 0.1,
  });

  registry.registerEntity('phylo2', 'Phylonode', {
    id: 2,
    identifier: 'phylo2',
    isRoot: false,
    length: 0.15,
  });

  // === QTL-related entities ===
  registry.registerEntity(
    'trait1',
    'Trait',
    {
      id: 1,
      primaryIdentifier: 'TRAIT001',
      description: 'Quantitative measurement of plant height',
      name: 'Plant Height',
    },
    {
      organism: ['org1'],
      qtls: ['qtl1'],
    },
  );

  registry.registerEntity(
    'qtlstudy1',
    'QTLStudy',
    {
      id: 1,
      primaryIdentifier: 'QTLS001',
      description: 'Plant height QTL mapping study in Arabidopsis',
      genotypes: 'RIL population from Col-0 x Ler-0',
      synopsis: 'Comprehensive QTL mapping for plant height traits',
    },
    {
      organism: ['org1'],
      qtls: ['qtl1'],
    },
  );

  registry.registerEntity(
    'qtl1',
    'QTL',
    {
      id: 1,
      primaryIdentifier: 'QTL001',
      name: 'Height QTL on Chr1',
      lod: 3.2,
      likelihoodRatio: 8.5,
      end: 1250000,
      markerR2: 0.15,
      start: 1100000,
      peak: 1175000,
      markerNames: 'M1,M2,M3',
    },
    {
      trait: ['trait1'],
      qtlStudy: ['qtlstudy1'],
      linkageGroup: ['lg1'],
      dataSets: ['dataset1'],
    },
  );

  registry.registerEntity('lg1', 'LinkageGroup', {
    id: 1,
    primaryIdentifier: 'LG1',
    name: 'Linkage Group 1',
  });

  registry.registerEntity('dataset1', 'DataSet', {
    id: 1,
    name: 'Height_Study_Dataset',
    description: 'Dataset for plant height studies',
    licence: 'Public',
    url: 'https://example.com/dataset1',
  });

  console.log('Biological test graph created:', registry.getStats());
  return registry;
}

/**
 * Create a simplified test graph for basic testing
 */
export function createSimplifiedTestGraph(): MockEntityRegistry {
  const registry = new MockEntityRegistry();

  // Just create core entities for simple tests
  registry.registerEntity('org1', 'Organism', {
    taxonId: '3702',
    name: 'Arabidopsis thaliana',
  });

  registry.registerEntity(
    'gene1',
    'Gene',
    {
      primaryIdentifier: 'AT1G01010',
      name: 'NAC domain protein',
    },
    {
      organism: ['org1'],
    },
  );

  return registry;
}
