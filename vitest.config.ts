import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',

    // Setup files - conditional based on test type
    setupFiles: [
      // Regular tests with MSW mocking
      './tests/setup/test-setup.ts',
      // Real integration tests don't use MSW setup
    ],

    // Test file patterns
    include: ['tests/**/*.test.ts', 'tests/**/*.spec.ts'],
    exclude: ['node_modules/**', 'dist/**'],

    coverage: {
      enabled: false, // Disable by default, enable with --coverage flag
      provider: 'v8', // Use v8 instead of c8 for better compatibility
      reporter: ['text', 'html', 'lcov', 'json'],
      exclude: [
        'dist/',
        'tests/',
        'node_modules/',
        '**/*.d.ts',
        'eslint.config.js',
        'vitest.config.ts',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 85,
          lines: 85,
          statements: 85,
        },
      },
    },

    // Timeout settings - longer for real integration tests
    testTimeout: 60000, // 60 seconds for real integration tests
    hookTimeout: 30000, // 30 seconds for setup/teardown

    // Reporter configuration
    reporter: process.env.CI ? ['junit', 'github-actions'] : ['verbose'],
    outputFile: {
      junit: './test-results.xml',
    },

    // Test isolation and parallel execution
    isolate: true,
    pool: 'forks', // Use separate processes for better isolation
    poolOptions: {
      forks: {
        singleFork: false, // Allow parallel execution
      },
    },
  },

  // Define test workspaces for different test types
  workspace: [
    {
      test: {
        name: 'unit',
        include: ['tests/unit/**/*.test.ts'],
        setupFiles: [], // No MSW for unit tests
      },
    },
    {
      test: {
        name: 'integration-mocked',
        include: ['tests/integration/**/!(*real*).test.ts'],
        setupFiles: ['./tests/setup/test-setup.ts'], // MSW for mocked tests
      },
    },
    {
      test: {
        name: 'integration-real',
        include: [
          'tests/integration/real/**/*.test.ts',
          'tests/performance/**/*.test.ts',
        ],
        setupFiles: [], // No MSW for real integration tests
        testTimeout: 120000, // 2 minutes for real tests
      },
    },
  ],
});
