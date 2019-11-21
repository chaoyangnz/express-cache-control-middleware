import minimatch from 'minimatch';
import { RequestHandler } from 'express';
import { format } from 'util'

export interface CacheControlOptions {
  private?: boolean,
  public?: boolean,
  noStore?: boolean,
  noCache?: boolean,
  maxAge?: number,
  sMaxAge?: number,
  noTransform?: boolean,
  proxyRevalidate?: boolean,
  mustRevalidate?: boolean,
  staleIfError?: boolean,
  staleWhileRevalidate?: boolean
}

export interface CacheConfig {
  // @ts-ignore
  default: CacheControlOptions,
  [key: string]: CacheControlOptions
}

export function cacheControl(cacheConfig: CacheConfig) {
  return function(req, res, next) {
    let matchedKey: string =
      Object.keys(cacheConfig).find((key) => minimatch(req.path, key)) || 'default'
    const options = cacheConfig[matchedKey];
    if (options) {
      const header = buildCacheControlHeader(options)
      res.set('Cache-Control', header);
      console.debug(`URL ${req.path} -> Cache-Control: ${header}`)
    }
    next();
  } as RequestHandler;
}

function buildCacheControlHeader(options: CacheControlOptions) {
  const cacheControl = [];

  if (options.private) {
    cacheControl.push('private');
  } else if (options.public) {
    cacheControl.push('public');
  }

  if (options.noStore) {
    options.noCache = true;
    cacheControl.push('no-store');
  }

  if (options.noCache) {
    options.maxAge = 0;
    delete options.sMaxAge;
    cacheControl.push('no-cache');
  }

  if (options.noTransform) {
    cacheControl.push('no-transform');
  }

  if (options.proxyRevalidate) {
    cacheControl.push('proxy-revalidate');
  }

  if (options.mustRevalidate) {
    cacheControl.push('must-revalidate');
  } else if (!options.noCache) {
    if (options.staleIfError) {
      cacheControl.push(format('stale-if-error=%d', options.staleIfError));
    }

    if (options.staleWhileRevalidate) {
      cacheControl.push(format('stale-while-revalidate=%d', options.staleWhileRevalidate));
    }
  }

  if (typeof options.maxAge === 'number') {
    cacheControl.push(format('max-age=%d', options.maxAge));
  }

  if (typeof options.sMaxAge === 'number') {
    cacheControl.push(format('s-maxage=%d', options.sMaxAge));
  }

  return cacheControl.join(',')
}
