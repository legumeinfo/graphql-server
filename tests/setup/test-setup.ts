import {beforeAll, afterAll, afterEach} from 'vitest';
import {server} from '../__helpers__/mock-intermine';

// Establish API mocking before all tests
beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'warn',
  });
});

// Reset any request handlers after each test
afterEach(() => {
  server.resetHandlers();
});

// Clean up after all tests are done
afterAll(() => {
  server.close();
});

// Global test configuration
// Enable console.log for debugging
global.console = {
  ...global.console,
  log: global.console.log, // Always enable for debugging
};
