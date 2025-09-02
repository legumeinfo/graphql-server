# Testing
## How to Run Tests
First, run the GraphQL server (directly via Bun or with Docker) and ensure it's available at http://localhost:4000/graphql.

Next, run the following in the command line:

```bash
TEST_WITH_REAL_ENDPOINTS=true npm run test tests/integration/real/data-validation-schema-compliance.test.ts
```
