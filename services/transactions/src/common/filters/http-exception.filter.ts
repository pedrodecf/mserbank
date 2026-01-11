import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'object' && !('errors' in exceptionResponse)) {
      return response.status(status).json(exceptionResponse);
    }

    if (typeof exceptionResponse === 'object' && 'errors' in exceptionResponse) {
      return response.status(status).json({
        name: exception.name,
        statusCode: status,
        message: 'Erro de validação',
        descriptions: exceptionResponse.errors,
      });
    }

    return response.status(status).json({
      name: exception.name,
      statusCode: status,
      message: exceptionResponse,
    });
  }
}
