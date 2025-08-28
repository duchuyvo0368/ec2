import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { logger } from '../../api/utils/logger'; 


export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : exception instanceof Error
                    ? exception.message
                    : 'Internal Server Error';

        logger.error(
            `[${request.method}] ${request.url}: ${JSON.stringify(message)}`
        );

        response.status(status).json({
            status: 'error',
            code: status,
            message: typeof message === 'string' ? message : message['message'] || message,
        });
    }
}
  