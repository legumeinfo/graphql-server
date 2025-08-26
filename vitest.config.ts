import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup/test-setup.ts'],
    coverage: {
      enabled: false, // Disable by default, enable with --coverage flag
      provider: 'v8', // Use v8 instead of c8 for better compatibility
      reporter: ['text', 'html', 'lcov'],
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
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
