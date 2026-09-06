import { GraphQLError } from 'graphql';

export const NOT_AUTHENTICATED_ERROR = new GraphQLError('Not authenticated', { extensions: { code: 'NOT_AUTHENTICATED', http: { status: 401 } } });
export const NOT_AUTHORIZED_ERROR = new GraphQLError('Not authorized', { extensions: { code: 'NOT_AUTHORIZED', http: { status: 403 } } });
export const NOT_FOUND_ERROR = new GraphQLError('Not found', { extensions: { code: 'NOT_FOUND', http: { status: 404 } } });

export const ERROR_MESSAGE = (message: string, code: string, status: number): GraphQLError => {
    return new GraphQLError(message, { extensions: { code, http: { status } } });
};



/*
import { GraphQLError } from 'graphql';

type ErrorCode =
  | 'NOT_AUTHENTICATED'
  | 'NOT_AUTHORIZED'
  | 'NOT_FOUND'
  | 'BAD_USER_INPUT'
  | 'INTERNAL_SERVER_ERROR';

export const createGraphQLError = (
  message: string,
  code: ErrorCode,
  status: number,
  details?: Record<string, unknown>
): GraphQLError => {
  return new GraphQLError(message, {
    extensions: {
      code,
      http: { status },
      ...(details ? { details } : {}),
    },
  });
};

export const NOT_AUTHENTICATED_ERROR = createGraphQLError(
  'Not authenticated',
  'NOT_AUTHENTICATED',
  401
);

export const NOT_AUTHORIZED_ERROR = createGraphQLError(
  'Not authorized',
  'NOT_AUTHORIZED',
  403
);

export const NOT_FOUND_ERROR = createGraphQLError(
  'Not found',
  'NOT_FOUND',
  404
);
*/