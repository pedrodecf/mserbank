import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ProxyMiddleware.name);
  private customersProxy: RequestHandler;
  private transactionsProxy: RequestHandler;

  constructor() {
    const customersUrl = process.env.CUSTOMERS_SERVICE_URL || 'http://localhost:3001';
    const transactionsUrl = process.env.TRANSACTIONS_SERVICE_URL || 'http://localhost:3002';

    const createProxyWithLogging = (target: string, pathRewrite: Record<string, string>) => {
      return createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite,
        on: {
          proxyReq: (proxyReq, req) => {
            const expressReq = req as Request;
            this.logger.debug(
              {
                method: expressReq.method,
                originalUrl: expressReq.originalUrl,
                target: proxyReq.path,
              },
              'Proxying request',
            );
          },
          proxyRes: (proxyRes, req) => {
            const expressReq = req as Request;
            this.logger.debug(
              {
                method: expressReq.method,
                originalUrl: expressReq.originalUrl,
                statusCode: proxyRes.statusCode,
              },
              'Proxy response received',
            );
          },
          error: (err, req) => {
            const expressReq = req as Request;
            this.logger.error(
              {
                err,
                method: expressReq.method,
                originalUrl: expressReq.originalUrl,
              },
              'Proxy error',
            );
          },
        },
      });
    };

    this.customersProxy = createProxyWithLogging(customersUrl, {
      '^/api/users': '/api/users',
    });

    this.transactionsProxy = createProxyWithLogging(transactionsUrl, {
      '^/api/transactions': '/api/transactions',
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    if (req.path.startsWith('/api/users')) {
      this.customersProxy(req, res, next);
    } else if (req.path.startsWith('/api/transactions')) {
      this.transactionsProxy(req, res, next);
    } else {
      res.status(404).json({
        statusCode: 404,
        message: 'Route not found',
        path: req.path,
      });
    }
  }
}
