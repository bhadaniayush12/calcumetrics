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
  "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.googletagmanager.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.googletagmanager.com https://cloudflareinsights.com https://*.cloudflareinsights.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests;";

export async function onRequest(context: PagesContext): Promise<Response> {
  try {
    const response = await context.next();
    const url = new URL(context.request.url);

    const newHeaders = new Headers(response.headers);

    // Security headers for Best Practices / Lighthouse
    if (!newHeaders.has('Strict-Transport-Security')) {
      newHeaders.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    if (!newHeaders.has('Cross-Origin-Opener-Policy')) {
      newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    }
    if (!newHeaders.has('Content-Security-Policy')) {
      newHeaders.set('Content-Security-Policy', CSP_POLICY);
    }

    // If request is on a pages.dev hostname (preview/staging), add noindex, nofollow
    if (url.hostname.includes('pages.dev')) {
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
