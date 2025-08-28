/**
 * Comprehensive Relationship Testing Suite
 *
 * Demonstrates the new smart relationship testing infrastructure
 * with systematic validation of complex GraphQL entity relationships.
 */

import {describe, test, expect, beforeAll, afterAll} from 'vitest';
import {setupServer} from 'msw/node';
import {
  createTestServer,
  executeQuery,
} from '../../__helpers__/apollo-server.js';
import {createBiologicalTestGraph} from '../../__helpers__/biological-graph.js';
import {createSmartHandlers} from '../../__helpers__/smart-handler.js';
import {
  validateRelationship,
  validateBiologicalRelationships,
} from '../../__helpers__/relationship-validators.js';

// Test infrastructure setup
const testRegistry = createBiologicalTestGraph();
const smartHandlers = createSmartHandlers(testRegistry);
const smartServer = setupServer(...smartHandlers);

describe('Comprehensive GraphQL Relationship Resolution', () => {
  beforeAll(() => {
    console.log(
      'Starting smart relationship testing with registry:',
      testRegistry.getStats(),
    );
    smartServer.listen({onUnhandledRequest: 'warn'});
  });

  afterAll(() => {
    smartServer.close();
  });

  describe('Direct Relationship Resolution', () => {
    test('resolves gene -> organism relationship correctly', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestGeneOrganism {
          gene(identifier: "AT1G01010") {
            results {
              identifier
              name
              organism {
                taxonId
                name
                genus
                species
              }
            }
          }
        }`,
        {},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      if (response.body.singleResult.data) {
        const gene = response.body.singleResult.data.gene.results;

        // Validate direct gene fields
        expect(gene.identifier).toBe('AT1G01010');
        expect(gene.name).toBe('NAC domain containing protein 1');

        // Validate organism relationship using smart validator
        const organism = validateRelationship.withFields(
          gene,
          'organism',
          {
            taxonId: '3702',
            name: 'Arabidopsis thaliana',
            genus: 'Arabidopsis',
            species: 'thaliana',
          },
          {description: 'gene -> organism relationship'},
        );

        expect(organism).toBeDefined();
      }
    });

    test('resolves protein -> strain relationship correctly', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestProteinStrain {
          protein(identifier: "AT1G01010.1") {
            results {
              identifier
              name
              strain {
                identifier
                name
                description
              }
            }
          }
        }`,
        {},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      if (response.body.singleResult.data) {
        const protein = response.body.singleResult.data.protein.results;

        // Validate strain relationship
        const strain = validateRelationship.withFields(
          protein,
          'strain',
          {
            identifier: 'Col-0',
            name: 'Col-0',
          },
          {description: 'protein -> strain relationship'},
        );

        expect(strain.description).toContain('Reference strain');
      }
    });
  });

  describe('Nested Relationship Chains', () => {
    test('resolves gene -> transcript -> protein chain correctly', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestGeneTranscriptProteinChain {
          gene(identifier: "AT1G01010") {
            results {
              identifier
              transcripts {
                identifier
                length
                protein {
                  identifier
                  molecularWeight
                  sequence {
                    length
                    md5checksum
                  }
                }
              }
            }
          }
        }`,
        {},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      if (response.body.singleResult.data) {
        const gene = response.body.singleResult.data.gene.results;

        // Validate transcript collection
        const transcripts = validateRelationship.collection(
          gene,
          'transcripts',
          {
            expectedCount: 1,
            validator: (transcript) => {
              expect(transcript.identifier).toBe('AT1G01010.1');
              expect(typeof transcript.length).toBe('number');
            },
            description: 'gene -> transcripts collection',
          },
        );

        // Validate nested protein relationship
        const transcript = transcripts[0];
        const protein = validateRelationship.withFields(
          transcript,
          'protein',
          {
            identifier: 'AT1G01010.1',
            molecularWeight: 'typeof:number',
          },
          {description: 'transcript -> protein relationship'},
        );

        // Validate sequence chain
        const sequence = validateRelationship.chain(protein, ['sequence'], {
          validator: (seq) => {
            expect(typeof seq.length).toBe('number');
            expect(typeof seq.md5checksum).toBe('string');
          },
          description: 'protein -> sequence chain',
        });

        expect(sequence).toBeDefined();
      }
    });

    test('resolves QTL -> trait -> organism chain correctly', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestQTLTraitOrganismChain {
          qtl(identifier: "QTL001") {
            results {
              identifier
              name
              lod
              trait {
                identifier
                name
                organism {
                  taxonId
                  name
                }
              }
              qtlStudy {
                identifier
                organism {
                  taxonId
                }
              }
            }
          }
        }`,
        {},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      if (response.body.singleResult.data) {
        const qtl = response.body.singleResult.data.qtl.results;

        // Validate QTL basic fields
        expect(qtl.identifier).toBe('QTL001');
        expect(typeof qtl.lod).toBe('number');

        // Validate QTL -> Trait -> Organism chain
        const traitOrganism = validateRelationship.chain(
          qtl,
          ['trait', 'organism'],
          {
            validator: (organism) => {
              expect(organism.taxonId).toBe('3702');
              expect(organism.name).toBe('Arabidopsis thaliana');
            },
            description: 'QTL -> trait -> organism chain',
          },
        );

        // Validate QTL -> QTLStudy -> Organism chain
        const studyOrganism = validateRelationship.chain(
          qtl,
          ['qtlStudy', 'organism'],
          {
            validator: (organism) => {
              expect(organism.taxonId).toBe('3702');
            },
            description: 'QTL -> qtlStudy -> organism chain',
          },
        );

        // Validate organism consistency across chains
        expect(traitOrganism.taxonId).toBe(studyOrganism.taxonId);
      }
    });
  });

  describe('Bidirectional Relationship Consistency', () => {
    test('validates gene <-> protein bidirectional consistency', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      // Get gene with proteins
      const geneResponse = await executeQuery(
        server,
        `query TestGeneBidirectional {
          gene(identifier: "AT1G01010") {
            results {
              identifier
              proteins {
                identifier
                gene {
                  identifier
                }
              }
            }
          }
        }`,
        {},
        contextValue,
      );

      // Get protein with gene
      const proteinResponse = await executeQuery(
        server,
        `query TestProteinBidirectional {
          protein(identifier: "AT1G01010.1") {
            results {
              identifier
              gene {
                identifier
                proteins {
                  identifier
                }
              }
            }
          }
        }`,
        {},
        contextValue,
      );

      expect(geneResponse.body.kind).toBe('single');
      expect(proteinResponse.body.kind).toBe('single');

      if (
        geneResponse.body.singleResult.data &&
        proteinResponse.body.singleResult.data
      ) {
        const gene = geneResponse.body.singleResult.data.gene.results;
        const protein = proteinResponse.body.singleResult.data.protein.results;

        // Validate bidirectional consistency
        validateRelationship.bidirectional(
          gene,
          protein,
          'proteins', // gene.proteins should contain protein
          'gene', // protein.gene should point to gene
          {description: 'gene <-> protein bidirectional relationship'},
        );

        // Validate specific consistency
        expect(gene.proteins[0].identifier).toBe(protein.identifier);
        expect(protein.gene.identifier).toBe(gene.identifier);
        expect(protein.gene.proteins[0].identifier).toBe(protein.identifier);
      }
    });
  });

  describe('Collection Relationship Validation', () => {
    test('validates organism -> genes collection properly', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestOrganismGenesCollection {
          organism(taxonId: "3702") {
            results {
              taxonId
              name
              genes {
                identifier
                name
                length
                organism {
                  taxonId
                }
              }
            }
          }
        }`,
        {},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      if (response.body.singleResult.data) {
        const organism = response.body.singleResult.data.organism.results;

        // Validate genes collection
        const genes = validateRelationship.collection(organism, 'genes', {
          validator: (gene) => {
            expect(typeof gene.identifier).toBe('string');
            expect(typeof gene.length).toBe('number');
            expect(gene.organism.taxonId).toBe('3702'); // Back-reference consistency
          },
          description: 'organism -> genes collection',
        });

        expect(genes.length).toBeGreaterThan(0);

        // Validate that all genes belong to the same organism
        genes.forEach((gene) => {
          expect(gene.organism.taxonId).toBe(organism.taxonId);
        });
      }
    });
  });

  describe('Optional Relationship Handling', () => {
    test('gracefully handles null optional relationships', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestOptionalRelationships {
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
        }`,
        {},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      if (response.body.singleResult.data) {
        const gene = response.body.singleResult.data.gene.results;

        // Validate optional relationships (may be null)
        const supercontig = validateRelationship.optional(gene, 'supercontig', {
          validator: (sc) => {
            expect(typeof sc.identifier).toBe('string');
          },
          description: 'gene -> supercontig optional relationship',
        });

        const supercontigLocation = validateRelationship.optional(
          gene,
          'supercontigLocation',
          {
            validator: (loc) => {
              expect(typeof loc.start).toBe('number');
              expect(typeof loc.end).toBe('number');
            },
            description: 'gene -> supercontigLocation optional relationship',
          },
        );

        // These may be null and that's okay
        console.log(
          `Optional relationships: supercontig=${!!supercontig}, supercontigLocation=${!!supercontigLocation}`,
        );
      }
    });
  });

  describe('Data Type Consistency Across Relationships', () => {
    test('validates consistent data types across relationship chains', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const response = await executeQuery(
        server,
        `query TestDataTypeConsistency {
          gene(identifier: "AT1G01010") {
            results {
              identifier
              length
              organism {
                taxonId
                name
              }
              strain {
                identifier
              }
              chromosome {
                identifier
                length
              }
              sequence {
                length
                md5checksum
              }
            }
          }
        }`,
        {},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      if (response.body.singleResult.data) {
        const gene = response.body.singleResult.data.gene.results;

        // Validate data types using comprehensive validator
        validateRelationship.dataTypes(
          gene,
          'organism',
          {
            taxonId: 'string',
            name: 'string',
          },
          {description: 'organism data types'},
        );

        validateRelationship.dataTypes(
          gene,
          'strain',
          {
            identifier: 'string',
          },
          {description: 'strain data types'},
        );

        validateRelationship.dataTypes(
          gene,
          'chromosome',
          {
            identifier: 'string',
            length: 'number',
          },
          {description: 'chromosome data types'},
        );

        validateRelationship.dataTypes(
          gene,
          'sequence',
          {
            length: 'number',
            md5checksum: 'string',
          },
          {description: 'sequence data types'},
        );

        // Validate biological relationships using specialized validator
        validateBiologicalRelationships.organism(gene);
        validateBiologicalRelationships.sequence(gene);
      }
    });
  });

  describe('Performance and Complex Query Validation', () => {
    test('handles complex multi-level relationship queries efficiently', async () => {
      const {server, context} = await createTestServer();
      const contextValue = await context();

      const startTime = Date.now();

      const response = await executeQuery(
        server,
        `query TestComplexRelationships {
          gene(identifier: "AT1G01010") {
            results {
              identifier
              organism {
                name
                genes {
                  identifier
                  proteins {
                    identifier
                    transcript {
                      identifier
                      gene {
                        organism {
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }`,
        {},
        contextValue,
      );

      const endTime = Date.now();
      const queryTime = endTime - startTime;

      expect(queryTime).toBeLessThan(1000); // Should complete within 1 second
      expect(response.body.kind).toBe('single');

      if (response.body.singleResult.data) {
        const gene = response.body.singleResult.data.gene.results;

        // Validate complex nested structure
        const organism = validateRelationship.direct(gene, 'organism');
        const organismGenes = validateRelationship.collection(
          organism,
          'genes',
        );

        // Validate that we can traverse deep relationships
        organismGenes.forEach((orgGene) => {
          const proteins = validateRelationship.collection(
            orgGene,
            'proteins',
            {allowNull: true},
          );

          proteins?.forEach((protein) => {
            const transcript = validateRelationship.optional(
              protein,
              'transcript',
            );

            if (transcript) {
              const transcriptGene = validateRelationship.direct(
                transcript,
                'gene',
              );
              const finalOrganism = validateRelationship.direct(
                transcriptGene,
                'organism',
              );

              // Validate circular consistency
              expect(finalOrganism.name).toBe(organism.name);
            }
          });
        });
      }

      console.log(`Complex relationship query completed in ${queryTime}ms`);
    });
  });
});
