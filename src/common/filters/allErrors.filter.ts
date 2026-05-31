import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { status } from '@grpc/grpc-js';
import { throwError } from 'rxjs';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaRpcExceptionFilter implements ExceptionFilter {
  catch(error: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    switch (error.code) {
      case 'P2002':
        return throwError(() => ({
          code: status.ALREADY_EXISTS,
          details: 'Unique constraint violation',
        }));

      case 'P2025':
        return throwError(() => ({
          code: status.NOT_FOUND,
          details: 'Record not found',
        }));

      case 'P2003':
        return throwError(() => ({
          code: status.FAILED_PRECONDITION,
          details: 'Related resource not found',
        }));

      default:
        return throwError(() => ({
          code: status.INTERNAL,
          details: 'Database error',
        }));
    }
  }
}