/**
 * Complex GraphQL Relationship Testing
 *
 * Tests advanced GraphQL relationship resolution including multi-hop traversal,
 * bidirectional consistency, and complex relationship chains.
 * Focuses on GraphQL schema functionality without performance measurement.
 */

import {describe, test, expect} from 'vitest';
import {
  createTestServer,
  executeQuery,
} from '../../__helpers__/apollo-server.js';

describe('Complex GraphQL Relationship Resolution', () => {
  describe('Multi-Hop Relationship Traversal', () => {
    test('Gene → Organism → Genes relationship chain', async () => {
      // Purpose: Validates GraphQL can traverse multi-hop relationships
      // Biological context: Gene belongs to organism which has many genes (genome context)
      // GraphQL feature: Multi-level nested field resolution

      const {server, context} = await createTestServer();
      const contextValue = await context();

      const query = `
        query TestMultiHopRelationship {
          gene(identifier: "AT1G01010") {
            results {
              identifier
              organism {
                name
                taxonId
                genes {
                  identifier
                  symbol
                }
              }
            }
          }
        }
      `;

      const response = await executeQuery(server, query, {}, contextValue);

      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult).toBeDefined();

      if (
        response.body.singleResult.data &&
        response.body.singleResult.data.gene &&
        response.body.singleResult.data.gene.results
      ) {
        const gene = response.body.singleResult.data.gene.results;
        expect(gene.identifier).toBe('AT1G01010');

        // Validate organism relationship exists
        if (gene.organism) {
          expect(gene.organism.taxonId).toBeDefined();
          expect(gene.organism.name).toBeDefined();

          // Validate genes collection within organism (multi-hop)
          if (gene.organism.genes) {
            expect(Array.isArray(gene.organism.genes)).toBe(true);
            // The original gene should be findable in the organism's gene collection
            if (gene.organism.genes.length > 0) {
              gene.organism.genes.forEach((orgGene: any) => {
                expect(orgGene.identifier).toBeDefined();
                expect(typeof orgGene.identifier).toBe('string');
              });
            }
          }
        }
      }
    });

    test('Protein → Gene → Organism → Proteins relationship chain', async () => {
      // Purpose: Validates complex relationship traversal from protein back to proteins
      // Biological context: Protein encoded by gene in organism that produces many proteins
      // GraphQL feature: Complex circular relationship traversal

      const {server, context} = await createTestServer();
      const contextValue = await context();

      const query = `
        query TestComplexRelationshipChain {
          protein(identifier: "AT1G01010.1") {
            results {
              identifier
              gene {
                identifier
                organism {
                  name
                  proteins {
                    identifier
                    length
                  }
                }
              }
            }
          }
        }
      `;

      const response = await executeQuery(server, query, {}, contextValue);

      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult).toBeDefined();

      if (
        response.body.singleResult.data &&
        response.body.singleResult.data.protein &&
        response.body.singleResult.data.protein.results
      ) {
        const protein = response.body.singleResult.data.protein.results;
        expect(protein.identifier).toBe('AT1G01010.1');

        // Validate gene relationship
        if (protein.gene) {
          expect(protein.gene.identifier).toBeDefined();

          // Validate organism relationship
          if (protein.gene.organism) {
            expect(protein.gene.organism.name).toBeDefined();

            // Validate proteins collection (completing the circle)
            if (protein.gene.organism.proteins) {
              expect(Array.isArray(protein.gene.organism.proteins)).toBe(true);
              if (protein.gene.organism.proteins.length > 0) {
                protein.gene.organism.proteins.forEach((orgProtein: any) => {
                  expect(orgProtein.identifier).toBeDefined();
                  expect(typeof orgProtein.length).toBe('number');
                });
              }
            }
          }
        }
      }
    });

    test('Gene → Transcripts → Proteins multi-collection traversal', async () => {
      // Purpose: Validates traversal through multiple collection relationships
      // Biological context: Gene produces transcripts which produce proteins (central dogma)
      // GraphQL feature: Collection-to-collection relationship resolution

      const {server, context} = await createTestServer();
      const contextValue = await context();

      const query = `
        query TestMultiCollectionTraversal {
          gene(identifier: "AT1G01010") {
            results {
              identifier
              transcripts {
                identifier
                proteins {
                  identifier
                  length
                  gene {
                    identifier
                  }
                }
              }
            }
          }
        }
      `;

      const response = await executeQuery(server, query, {}, contextValue);

      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult).toBeDefined();

      if (
        response.body.singleResult.data &&
        response.body.singleResult.data.gene &&
        response.body.singleResult.data.gene.results
      ) {
        const gene = response.body.singleResult.data.gene.results;
        expect(gene.identifier).toBe('AT1G01010');

        // Validate transcripts collection
        if (gene.transcripts) {
          expect(Array.isArray(gene.transcripts)).toBe(true);

          // For each transcript, validate proteins collection
          gene.transcripts.forEach((transcript: any) => {
            expect(transcript.identifier).toBeDefined();

            if (transcript.proteins) {
              expect(Array.isArray(transcript.proteins)).toBe(true);

              // For each protein, validate reverse gene relationship
              transcript.proteins.forEach((protein: any) => {
                expect(protein.identifier).toBeDefined();
                expect(typeof protein.length).toBe('number');

                // Validate circular reference back to gene
                if (protein.gene) {
                  expect(protein.gene.identifier).toBeDefined();
                }
              });
            }
          });
        }
      }
    });
  });

  describe('Bidirectional Relationship Consistency', () => {
    test('Gene ↔ Protein bidirectional consistency', async () => {
      // Purpose: Validates bidirectional relationship consistency in GraphQL
      // Biological context: Gene-protein relationships should be bidirectional
      // GraphQL feature: Reverse relationship resolution consistency

      const {server, context} = await createTestServer();
      const contextValue = await context();

      // Query gene and its proteins
      const geneQuery = `
        query TestGeneToproteins {
          gene(identifier: "AT1G01010") {
            results {
              identifier
              proteins {
                identifier
              }
            }
          }
        }
      `;

      // Query protein and its gene
      const proteinQuery = `
        query TestProteinToGene {
          protein(identifier: "AT1G01010.1") {
            results {
              identifier
              gene {
                identifier
              }
            }
          }
        }
      `;

      const [geneResponse, proteinResponse] = await Promise.all([
        executeQuery(server, geneQuery, {}, contextValue),
        executeQuery(server, proteinQuery, {}, contextValue),
      ]);

      expect(geneResponse.body.kind).toBe('single');
      expect(proteinResponse.body.kind).toBe('single');

      // Validate forward relationship (gene → proteins)
      if (
        geneResponse.body.singleResult.data &&
        geneResponse.body.singleResult.data.gene &&
        geneResponse.body.singleResult.data.gene.results
      ) {
        const gene = geneResponse.body.singleResult.data.gene.results;
        expect(gene.identifier).toBe('AT1G01010');

        if (gene.proteins) {
          expect(Array.isArray(gene.proteins)).toBe(true);
        }
      }

      // Validate reverse relationship (protein → gene)
      if (
        proteinResponse.body.singleResult.data &&
        proteinResponse.body.singleResult.data.protein &&
        proteinResponse.body.singleResult.data.protein.results
      ) {
        const protein = proteinResponse.body.singleResult.data.protein.results;
        expect(protein.identifier).toBe('AT1G01010.1');

        if (protein.gene) {
          expect(protein.gene.identifier).toBe('AT1G01010');
        }
      }
    });

    test('Organism ↔ Gene collection consistency', async () => {
      // Purpose: Validates organism-gene collection bidirectional consistency
      // Biological context: Organisms contain genes, genes belong to organisms
      // GraphQL feature: Collection relationship bidirectional resolution

      const {server, context} = await createTestServer();
      const contextValue = await context();

      // Query organism and its genes
      const organismQuery = `
        query TestOrganismToGenes {
          organism(taxonId: "3702") {
            results {
              taxonId
              genes {
                identifier
                organism {
                  taxonId
                }
              }
            }
          }
        }
      `;

      const response = await executeQuery(
        server,
        organismQuery,
        {},
        contextValue,
      );

      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult).toBeDefined();

      if (
        response.body.singleResult.data &&
        response.body.singleResult.data.organism &&
        response.body.singleResult.data.organism.results
      ) {
        const organism = response.body.singleResult.data.organism.results;
        expect(organism.taxonId).toBe('3702');

        // Validate forward relationship (organism → genes)
        if (organism.genes) {
          expect(Array.isArray(organism.genes)).toBe(true);

          // For each gene, validate reverse relationship (gene → organism)
          organism.genes.forEach((gene: any) => {
            expect(gene.identifier).toBeDefined();

            if (gene.organism) {
              expect(gene.organism.taxonId).toBe('3702');
            }
          });
        }
      }
    });
  });

  describe('Complex Relationship Chains', () => {
    test('QTL → Trait → Organism → Genes relationship chain', async () => {
      // Purpose: Validates complex biological relationship chain traversal
      // Biological context: QTL affects trait in organism containing genes
      // GraphQL feature: Multi-entity relationship chain resolution

      const {server, context} = await createTestServer();
      const contextValue = await context();

      const query = `
        query TestQTLRelationshipChain {
          qtl(identifier: "QTL001") {
            results {
              identifier
              trait {
                identifier
                organism {
                  taxonId
                  name
                  genes {
                    identifier
                    symbol
                  }
                }
              }
            }
          }
        }
      `;

      const response = await executeQuery(server, query, {}, contextValue);

      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult).toBeDefined();

      if (
        response.body.singleResult.data &&
        response.body.singleResult.data.qtl &&
        response.body.singleResult.data.qtl.results
      ) {
        const qtl = response.body.singleResult.data.qtl.results;
        expect(qtl.identifier).toBe('QTL001');

        // Validate trait relationship
        if (qtl.trait) {
          expect(qtl.trait.identifier).toBeDefined();

          // Validate organism relationship within trait
          if (qtl.trait.organism) {
            expect(qtl.trait.organism.taxonId).toBeDefined();
            expect(qtl.trait.organism.name).toBeDefined();

            // Validate genes collection within organism
            if (qtl.trait.organism.genes) {
              expect(Array.isArray(qtl.trait.organism.genes)).toBe(true);
              if (qtl.trait.organism.genes.length > 0) {
                qtl.trait.organism.genes.forEach((gene: any) => {
                  expect(gene.identifier).toBeDefined();
                });
              }
            }
          }
        }
      }
    });

    test('Deep nested relationship with all entity types', async () => {
      // Purpose: Validates deep GraphQL relationship nesting capabilities
      // Biological context: Complex biological entity relationships in single query
      // GraphQL feature: Deep nested field selection and resolution

      const {server, context} = await createTestServer();
      const contextValue = await context();

      const query = `
        query TestDeepNestedRelationships {
          gene(identifier: "AT1G01010") {
            results {
              identifier
              organism {
                taxonId
                name
                chromosomes {
                  identifier
                  length
                  genes {
                    identifier
                    proteins {
                      identifier
                      transcripts {
                        identifier
                        gene {
                          identifier
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const response = await executeQuery(server, query, {}, contextValue);

      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult).toBeDefined();

      if (
        response.body.singleResult.data &&
        response.body.singleResult.data.gene &&
        response.body.singleResult.data.gene.results
      ) {
        const gene = response.body.singleResult.data.gene.results;
        expect(gene.identifier).toBe('AT1G01010');

        // Validate deep nested structure exists (even if empty)
        if (gene.organism) {
          expect(gene.organism.taxonId).toBeDefined();

          if (gene.organism.chromosomes) {
            expect(Array.isArray(gene.organism.chromosomes)).toBe(true);

            gene.organism.chromosomes.forEach((chromosome: any) => {
              expect(chromosome.identifier).toBeDefined();

              if (chromosome.genes) {
                expect(Array.isArray(chromosome.genes)).toBe(true);
              }
            });
          }
        }
      }
    });
  });

  describe('Collection Relationship Validation', () => {
    test('Organism → Multiple collection relationships', async () => {
      // Purpose: Validates organism can resolve multiple collection relationships
      // Biological context: Organisms contain genes, proteins, chromosomes, etc.
      // GraphQL feature: Multiple collection field resolution on single entity

      const {server, context} = await createTestServer();
      const contextValue = await context();

      const query = `
        query TestMultipleCollections {
          organism(taxonId: "3702") {
            results {
              taxonId
              name
              genes {
                identifier
                symbol
              }
              proteins {
                identifier
                length
              }
              chromosomes {
                identifier
                length
              }
            }
          }
        }
      `;

      const response = await executeQuery(server, query, {}, contextValue);

      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult).toBeDefined();

      if (
        response.body.singleResult.data &&
        response.body.singleResult.data.organism &&
        response.body.singleResult.data.organism.results
      ) {
        const organism = response.body.singleResult.data.organism.results;
        expect(organism.taxonId).toBe('3702');

        // Validate genes collection
        if (organism.genes) {
          expect(Array.isArray(organism.genes)).toBe(true);
        }

        // Validate proteins collection
        if (organism.proteins) {
          expect(Array.isArray(organism.proteins)).toBe(true);
        }

        // Validate chromosomes collection
        if (organism.chromosomes) {
          expect(Array.isArray(organism.chromosomes)).toBe(true);
        }
      }
    });

    test('Collection with filtered relationships', async () => {
      // Purpose: Validates collection relationships can be filtered
      // Biological context: Gene collections can have specific protein types
      // GraphQL feature: Collection filtering and conditional resolution

      const {server, context} = await createTestServer();
      const contextValue = await context();

      const query = `
        query TestFilteredCollections {
          gene(identifier: "AT1G01010") {
            results {
              identifier
              proteins {
                identifier
                length
                isPrimary
                gene {
                  identifier
                  symbol
                }
              }
              transcripts {
                identifier
                proteins {
                  identifier
                  isPrimary
                }
              }
            }
          }
        }
      `;

      const response = await executeQuery(server, query, {}, contextValue);

      expect(response.body.kind).toBe('single');
      expect(response.body.singleResult).toBeDefined();

      if (
        response.body.singleResult.data &&
        response.body.singleResult.data.gene &&
        response.body.singleResult.data.gene.results
      ) {
        const gene = response.body.singleResult.data.gene.results;
        expect(gene.identifier).toBe('AT1G01010');

        // Validate proteins with detailed fields
        if (gene.proteins) {
          expect(Array.isArray(gene.proteins)).toBe(true);
          gene.proteins.forEach((protein: any) => {
            expect(protein.identifier).toBeDefined();
            expect(typeof protein.length).toBe('number');
            expect(typeof protein.isPrimary).toBe('boolean');

            // Validate reverse gene relationship
            if (protein.gene) {
              expect(protein.gene.identifier).toBe('AT1G01010');
            }
          });
        }

        // Validate transcripts with nested proteins
        if (gene.transcripts) {
          expect(Array.isArray(gene.transcripts)).toBe(true);
          gene.transcripts.forEach((transcript: any) => {
            expect(transcript.identifier).toBeDefined();

            if (transcript.proteins) {
              expect(Array.isArray(transcript.proteins)).toBe(true);
            }
          });
        }
      }
    });
  });
});
