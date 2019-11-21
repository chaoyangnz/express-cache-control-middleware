import { cacheControl } from './express-cache-control-middleware';
import { RequestHandler, Request, Response } from 'express';

describe('cache control', () => {
  const response: any = {
    set: jest.fn()
  };

  it('should match rule', () => {
    const cacheConfig = {
      '/example/url': {
        maxAge: 9999
      },
      default: {
        noCache: true
      }
    };
    const middleware: RequestHandler = cacheControl(cacheConfig);

    const request = {
      path: '/example/url'
    } as Request;

    const next = () => {
      expect(response.set).toHaveBeenCalledWith('Cache-Control', 'max-age=9999');
    };

    middleware(request, response, next);
  });

  it('should return default to default rule', () => {
    const cacheConfig = {
      '/example/url': {
        maxAge: 11111
      },
      default: {
        maxAge: 9999
      }
    };
    const middleware: RequestHandler = cacheControl(cacheConfig);

    const mockedRequest = {
      path: '/example/url/path'
    } as Request;

    const next = () => {
      expect(response.set).toHaveBeenCalledWith('Cache-Control', 'max-age=9999');
    };

    middleware(mockedRequest, response, next);
  });
});
