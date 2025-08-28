import {buildSchema, GraphQLSchema} from 'graphql';
import {typeDefs} from '../../src/types/index.js';

let schema: GraphQLSchema | null = null;

export function getTestSchema(): GraphQLSchema {
  if (!schema) {
    schema = buildSchema(typeDefs);
  }
  return schema;
}

export function validateResponseAgainstSchema(
  response: any,
  expectedType: string,
) {
  try {
    const testSchema = getTestSchema();
    const type = testSchema.getType(expectedType);

    if (!type) {
      return {
        isValid: false,
        errors: [`Type '${expectedType}' not found in schema`],
      };
    }

    // Basic validation - check if response has expected structure
    // In a real implementation, you'd use more sophisticated validation
    const errors: string[] = [];

    // Check if response is an object
    if (typeof response !== 'object' || response === null) {
      errors.push(`Expected object, got ${typeof response}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [error instanceof Error ? error.message : 'Validation error'],
    };
  }
}

// Helper to validate GraphQL response structure
export function validateGraphQLResponse(response: any) {
  const errors: string[] = [];

  // Check basic GraphQL response structure
  if (!response || typeof response !== 'object') {
    errors.push('Response must be an object');
    return {isValid: false, errors};
  }

  // GraphQL responses should have either 'data' or 'errors' or both
  const hasData = 'data' in response;
  const hasErrors = 'errors' in response;

  if (!hasData && !hasErrors) {
    errors.push('Response must contain either data or errors');
  }

  // If errors exist, they should be an array
  if (hasErrors && !Array.isArray(response.errors)) {
    errors.push('Errors field must be an array');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validate pagination info structure
export function validatePageInfo(pageInfo: any) {
  const errors: string[] = [];
  const requiredFields = [
    'currentPage',
    'pageSize',
    'hasNextPage',
    'hasPreviousPage',
    'pageCount',
    'numResults',
  ];

  if (!pageInfo || typeof pageInfo !== 'object') {
    errors.push('PageInfo must be an object');
    return {isValid: false, errors};
  }

  for (const field of requiredFields) {
    if (!(field in pageInfo)) {
      errors.push(`PageInfo missing required field: ${field}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
