import {beforeAll, afterAll, describe} from 'vitest';

// Configuration for real integration tests
export const REAL_TEST_CONFIG = {
  // Use the PeanutBase GraphQL server for testing
  GRAPHQL_URL:
    process.env.TEST_GRAPHQL_URL || 'https://dev.peanutbase.org/mwiese/graphql',

  // Test timeouts - real network calls take longer
  QUERY_TIMEOUT: 30000, // 30 seconds
  SETUP_TIMEOUT: 10000, // 10 seconds

  // Test data - use known identifiers from PeanutBase (Arachis data)
  KNOWN_GENE_ID: 'aradu.V14167.gnm1.ann1.Aradu.000JC', // Known Arachis duranensis gene
  KNOWN_ORGANISM_TAXON: '130453', // Arachis duranensis
  KNOWN_PROTEIN_ID: 'aradu.V14167.gnm1.ann1.Aradu.000JC.1', // Protein from known gene

  // Alternative test data for variety
  KNOWN_HYPOGAEA_TAXON: '3818', // Arachis hypogaea (cultivated peanut)
  KNOWN_GENUS: 'Arachis',
  KNOWN_SPECIES: 'duranensis',

  // Publication data (if available)
  KNOWN_PUBLICATION_DOI: '10.1038/nature08670', // May not exist in PeanutBase
};

// Setup for real integration tests - NO MSW mocking
export function setupRealIntegrationTests() {
  beforeAll(() => {
    console.log('🌐 Setting up REAL integration tests (no mocking)');
    console.log(`   GraphQL URL: ${REAL_TEST_CONFIG.GRAPHQL_URL}`);
    console.log('   Testing against PeanutBase server with Arachis data');
    console.log('   Tests will make actual network calls');
  }, REAL_TEST_CONFIG.SETUP_TIMEOUT);

  afterAll(() => {
    console.log('🧹 Cleaning up real integration tests');
  });
}

// Helper to skip tests if real endpoints are not available
export function skipIfNoRealEndpoints() {
  const hasRealEndpoints =
    process.env.TEST_GRAPHQL_URL ||
    process.env.TEST_WITH_REAL_ENDPOINTS === 'true';

  if (!hasRealEndpoints) {
    console.log(
      '⏭️  Skipping real integration tests - set TEST_WITH_REAL_ENDPOINTS=true or TEST_GRAPHQL_URL to enable',
    );
    return true;
  }
  return false;
}

// Wrapper for real integration test suites
export function realIntegrationSuite(name: string, fn: () => void) {
  describe(name, () => {
    if (skipIfNoRealEndpoints()) {
      describe.skip('Real integration tests disabled', () => {});
      return;
    }

    setupRealIntegrationTests();
    fn();
  });
}
