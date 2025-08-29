import {beforeAll, afterAll, describe} from 'vitest';

// Configuration for real integration tests
export const REAL_TEST_CONFIG = {
  // Use local GraphQL server that connects to LIS InterMine for testing
  GRAPHQL_URL: process.env.TEST_GRAPHQL_URL || 'http://localhost:4000/graphql',

  // InterMine endpoint that the GraphQL server will use
  INTERMINE_URL: 'https://mines.dev.lis.ncgr.org/minimine/service',

  // Test timeouts - real network calls take longer
  QUERY_TIMEOUT: 30000, // 30 seconds
  SETUP_TIMEOUT: 10000, // 10 seconds

  // Test data - use known identifiers from LIS InterMine (Phaseolus data)
  KNOWN_GENE_ID: 'phavu.5-593.gnm1.ann1.Pv5-593.01G000100', // Known Phaseolus vulgaris gene
  KNOWN_GENE_NAME: 'Pv5-593.01G000100',
  KNOWN_GENE_DESC: 'hydroxyproline-rich glycoprotein family protein',
  KNOWN_GENE_LENGTH: 6828,
  KNOWN_ORGANISM_TAXON: '3885', // Phaseolus vulgaris
  KNOWN_PROTEIN_ID: 'phavu.5-593.gnm1.ann1.Pv5-593.01G000100.1', // Protein from known gene
  KNOWN_PROTEIN_LENGTH: 474,
  KNOWN_PROTEIN_SEQ_RESIDUES:
    'MGSEQNRFPQHERRKRWGGCWGAFSCFGSQKGGKRIVPASRIPESSGPASQPNGPQVVGLTNQATGLAPSLLAPPSSPASFTHSALPSTAQSPSCFLSLSANSPGGPSSTMYATGPYAHETQLVSPPVFSNFTTEPSTAPLTPPPELAHLTTPSSPDVPFAHFLSSSVDLKNSDKGNYITANDLQATYSLYPGSPASSLISPISRNSGDCLSSSFPEREFRPQWDSSLYPENGKYQRTGSGRVSGHDTNGVTSASQDTNFFCPATYAQFYLDQNPPFPHNGGRLSVSKDSDVQSTGGNGHQSRHARSPKQDVEEIEAYRASFGFSADEIITTSQYVEISDVMEDSFAMMPFASGKSTVEENIEPSLMKGFKAQETQVALQSLRSLGSDPGPVGKEAHNQATIYQGYEDHKSQRHCSNSSGFSTPENPNLVDDEDIFSKMESSRISRKYKMGLSCSDAEIDYRRGRSLREGKGM*',
  KNOWN_GENUS: 'Phaseolus',
  KNOWN_SPECIES: 'vulgaris',
  KNOWN_NAME: 'Phaseolus vulgaris',
  KNOWN_SHORTNAME: 'P. vulgaris',
  KNOWN_ABBREV: 'phavu',
  KNOWN_COMMONNAME: 'common bean',
  KNOWN_STRAINS_LENGTH: 8,
  KNOWN_STRAINS: [
    '5-593',
    'BAT 93',
    'Flavert',
    'G19833',
    'Hystyle',
    'Labor Ovalle',
    'OAC Rex',
    'UI111',
  ],

  // Alternative test data for variety
  KNOWN_VIGNA_TAXON: '3917', // Vigna unguiculata (cowpea)

  // Publication data (if available)
  KNOWN_PUBLICATION_DOI: '10.1038/nature08670', // May not exist in LIS InterMine
};

// Setup for real integration tests - NO MSW mocking
export function setupRealIntegrationTests() {
  beforeAll(() => {
    console.log('🌐 Setting up REAL integration tests (no mocking)');
    console.log(`   GraphQL URL: ${REAL_TEST_CONFIG.GRAPHQL_URL}`);
    console.log('   Testing against LIS InterMine server with Phaseolus data');
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
