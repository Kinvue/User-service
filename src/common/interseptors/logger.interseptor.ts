import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { isUUID } from 'class-validator';
import { Observable, tap, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);

  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const rpcContext = context.switchToRpc();
    const methodName = context.getHandler().name;
    const controllerName = context.getClass().name;
    const data = rpcContext.getData() as Record<string, unknown>;

    this.logger.log(`gRPC payload: ${JSON.stringify(data)}`);

    const invalidField = this.getInvalidUuidField(data);

    if (invalidField) {
      return throwError(() =>
        new RpcException({
          code: status.INVALID_ARGUMENT,
          message: `${invalidField} must be UUID`,
        }),
      );
    }

    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `gRPC ${controllerName}.${methodName} - ${Date.now() - start}ms`,
        );
      }),
    );
  }

  private getInvalidUuidField(data: Record<string, unknown>): string | null {
    const uuidFields = [
      'id',
      'userId',
      'authUserId',
      'requesterId',
      'receiverId',
      'friendshipId',
    ];

    for (const field of uuidFields) {
      const value = data[field];

      if (typeof value === 'string' && value.length > 0 && !isUUID(value)) {
        return field;
      }
    }

    return null;
  }
}