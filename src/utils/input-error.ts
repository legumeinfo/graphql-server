import {ApolloServerErrorCode} from '@apollo/server/errors';
import {GraphQLError} from 'graphql';

export function inputError(msg: string) {
  throw new GraphQLError(msg, {
    extensions: {
      code: ApolloServerErrorCode.BAD_USER_INPUT,
    },
  });
}
