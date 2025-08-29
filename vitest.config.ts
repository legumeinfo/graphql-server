import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',

    // Test file patterns - only real integration tests remain
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
    testTimeout: 120000, // 2 minutes for real tests
    hookTimeout: 30000, // 30 seconds for setup/teardown

    // Reporter configuration
    reporters: process.env.CI ? ['junit', 'github-actions'] : ['verbose'],
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
});
