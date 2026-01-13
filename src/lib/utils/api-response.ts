import { NextResponse } from 'next/server';
import { ValidationError, NotFoundError, BusinessRuleError, StorageError } from './errors';

/**
 * Create a success JSON response
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

/**
 * Create an error JSON response
 */
export function errorResponse(
  error: Error | ValidationError | NotFoundError | BusinessRuleError | StorageError,
  status?: number
): NextResponse {
  let statusCode = status || 500;
  let errorCode = 'INTERNAL_ERROR';
  let field: string | undefined;

  if (error instanceof ValidationError) {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    field = error.field;
  } else if (error instanceof NotFoundError) {
    statusCode = 404;
    errorCode = 'NOT_FOUND';
  } else if (error instanceof BusinessRuleError) {
    statusCode = 400;
    errorCode = 'BUSINESS_RULE_ERROR';
  } else if (error instanceof StorageError) {
    statusCode = 500;
    errorCode = 'STORAGE_ERROR';
  }

  return NextResponse.json(
    {
      error: {
        code: errorCode,
        message: error.message,
        ...(field && { field }),
      },
    },
    { status: statusCode }
  );
}
