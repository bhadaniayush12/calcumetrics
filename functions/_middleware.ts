interface PagesContext {
  request: Request;
  next: () => Promise<Response>;
  env?: {
    ASSETS?: {
      fetch: (request: Request | URL | string) => Promise<Response>;
    };
    [key: string]: unknown;
  };
}

const CSP_POLICY =
  "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://static.cloudflareinsights.com https://pagead2.googlesyndication.com https://*.googlesyndication.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.doubleclick.net https://www.google.com https://*.google.com; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://*.googletagmanager.com https://www.google.com https://*.google.com https://cloudflareinsights.com https://*.cloudflareinsights.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.doubleclick.net; frame-src 'self' https://googleads.g.doubleclick.net https://*.doubleclick.net https://tpc.googlesyndication.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests;";

export async function onRequest(context: PagesContext): Promise<Response> {
  const url = new URL(context.request.url);

  // Trailing slash normalization: 301 permanent redirect any URL ending in "/" (except root "/")
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    const canonicalTarget = new URL(context.request.url);
    if (canonicalTarget.hostname === 'www.calcumetrics.com') {
      canonicalTarget.hostname = 'calcumetrics.com';
      canonicalTarget.protocol = 'https:';
    }
    canonicalTarget.pathname = canonicalTarget.pathname.replace(/\/+$/, '');

    return new Response(null, {
      status: 301,
      statusText: 'Moved Permanently',
      headers: {
        Location: canonicalTarget.toString(),
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      },
    });
  }

  // Canonical domain enforcement: 301 permanent redirect www.calcumetrics.com or calcumetrics.pages.dev -> calcumetrics.com
  if (url.hostname === 'www.calcumetrics.com' || url.hostname === 'calcumetrics.pages.dev') {
    const canonicalTarget = new URL(context.request.url);
    canonicalTarget.hostname = 'calcumetrics.com';
    canonicalTarget.protocol = 'https:';

    return new Response(null, {
      status: 301,
      statusText: 'Moved Permanently',
      headers: {
        Location: canonicalTarget.toString(),
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      },
    });
  }

  try {
    const response = await context.next();

    // Preview/branch deployments (e.g. abc123.calcumetrics.pages.dev) must never be indexed
    const isPreviewHost = url.hostname.endsWith('.pages.dev');

    // Preserve direct static asset handling (avoid re-wrapping response body for assets)
    if (
      url.pathname.startsWith('/_astro/') ||
      url.pathname.startsWith('/fonts/') ||
      /\.(svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|css|js)$/i.test(url.pathname)
    ) {
      if (isPreviewHost) {
        const h = new Headers(response.headers);
        h.set('X-Robots-Tag', 'noindex, nofollow');
        return new Response([204, 205, 304].includes(response.status) ? null : response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: h,
        });
      }
      return response;
    }

    const newHeaders = new Headers(response.headers);

    // Security headers for Best Practices / Lighthouse
    if (!newHeaders.has('Strict-Transport-Security')) {
      newHeaders.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    if (!newHeaders.has('Cross-Origin-Opener-Policy')) {
      newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    }
    newHeaders.set('Content-Security-Policy', CSP_POLICY);
    if (!newHeaders.has('X-Content-Type-Options')) {
      newHeaders.set('X-Content-Type-Options', 'nosniff');
    }
    if (!newHeaders.has('Referrer-Policy')) {
      newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    }
    if (!newHeaders.has('Permissions-Policy')) {
      newHeaders.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()');
    }
    if (!newHeaders.has('X-Frame-Options')) {
      newHeaders.set('X-Frame-Options', 'SAMEORIGIN');
    }

    // If request is on a pages.dev hostname (preview/staging), add noindex, nofollow
    if (isPreviewHost) {
      newHeaders.set('X-Robots-Tag', 'noindex, nofollow');
    }

    return new Response([204, 205, 304].includes(response.status) ? null : response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  } catch (_err) {
    const headers = new Headers({
      'Content-Type': 'text/html; charset=utf-8',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Content-Security-Policy': CSP_POLICY,
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
      'X-Frame-Options': 'SAMEORIGIN',
    });

    if (context.env?.ASSETS) {
      try {
        const errorPage = await context.env.ASSETS.fetch(new URL('/500.html', context.request.url));
        if (errorPage.ok) {
          return new Response(errorPage.body, {
            status: 500,
            statusText: 'Internal Server Error',
            headers,
          });
        }
      } catch {
        // Fallback to minimal response below
      }
    }

    return new Response('<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>500 Internal Server Error</title></head><body><h1>500 Internal Server Error</h1></body></html>', {
      status: 500,
      statusText: 'Internal Server Error',
      headers,
    });
  }
}
