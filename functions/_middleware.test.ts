import { describe, expect, it } from 'vitest';
import { onRequest } from './_middleware';

describe('Cloudflare Pages _middleware', () => {
  it('permanently redirects (301) root calcumetrics.pages.dev to canonical calcumetrics.com', async () => {
    let nextCalled = false;
    const context = {
      request: new Request('https://calcumetrics.pages.dev/sip-calculator'),
      next: async () => {
        nextCalled = true;
        return new Response('OK');
      },
    };

    const response = await onRequest(context);
    expect(response.status).toBe(301);
    expect(response.statusText).toBe('Moved Permanently');
    expect(response.headers.get('Location')).toBe('https://calcumetrics.com/sip-calculator');
    expect(nextCalled).toBe(false);
  });

  it('adds X-Robots-Tag on branch preview pages.dev subdomains', async () => {
    const context = {
      request: new Request('https://8703423f.calcumetrics.pages.dev/sip-calculator'),
      next: async () => new Response('OK'),
    };

    const response = await onRequest(context);
    expect(response.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
  });

  it('does NOT add X-Robots-Tag on custom production domain calcumetrics.com', async () => {
    const context = {
      request: new Request('https://calcumetrics.com/sip-calculator'),
      next: async () => new Response('OK', {
        headers: { 'X-Content-Type-Options': 'nosniff' },
      }),
    };

    const response = await onRequest(context);
    expect(response.headers.get('X-Robots-Tag')).toBeNull();
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('Strict-Transport-Security')).toBe('max-age=31536000; includeSubDomains');
    expect(response.headers.get('Cross-Origin-Opener-Policy')).toBe('same-origin-allow-popups');
  });

  it('permanently redirects (301) URLs with trailing slash (except root /)', async () => {
    let nextCalled = false;
    const context = {
      request: new Request('https://calcumetrics.com/sip-calculator/'),
      next: async () => {
        nextCalled = true;
        return new Response('OK');
      },
    };

    const response = await onRequest(context);
    expect(response.status).toBe(301);
    expect(response.statusText).toBe('Moved Permanently');
    expect(response.headers.get('Location')).toBe('https://calcumetrics.com/sip-calculator');
    expect(nextCalled).toBe(false);
  });

  it('preserves query parameters when redirecting trailing slash (301)', async () => {
    const context = {
      request: new Request('https://calcumetrics.com/sip-calculator/?p=5000&r=12'),
      next: async () => new Response('OK'),
    };

    const response = await onRequest(context);
    expect(response.status).toBe(301);
    expect(response.headers.get('Location')).toBe('https://calcumetrics.com/sip-calculator?p=5000&r=12');
  });

  it('does NOT redirect root path /', async () => {
    let nextCalled = false;
    const context = {
      request: new Request('https://calcumetrics.com/'),
      next: async () => {
        nextCalled = true;
        return new Response('OK');
      },
    };

    const response = await onRequest(context);
    expect(response.status).toBe(200);
    expect(nextCalled).toBe(true);
  });

  it('permanently redirects (301) www.calcumetrics.com to https://calcumetrics.com/', async () => {
    let nextCalled = false;
    const context = {
      request: new Request('https://www.calcumetrics.com/'),
      next: async () => {
        nextCalled = true;
        return new Response('OK');
      },
    };

    const response = await onRequest(context);
    expect(response.status).toBe(301);
    expect(response.statusText).toBe('Moved Permanently');
    expect(response.headers.get('Location')).toBe('https://calcumetrics.com/');
    expect(response.headers.get('Strict-Transport-Security')).toBe('max-age=31536000; includeSubDomains');
    expect(nextCalled).toBe(false);
  });

  it('permanently redirects (301) subpaths and query parameters from www.calcumetrics.com', async () => {
    const context = {
      request: new Request('https://www.calcumetrics.com/mortgage-calculator?downPayment=20&rate=7.5'),
      next: async () => new Response('OK'),
    };

    const response = await onRequest(context);
    expect(response.status).toBe(301);
    expect(response.headers.get('Location')).toBe('https://calcumetrics.com/mortgage-calculator?downPayment=20&rate=7.5');
  });

  it('permanently redirects (301) http://www.calcumetrics.com to https://calcumetrics.com', async () => {
    const context = {
      request: new Request('http://www.calcumetrics.com/mortgage-calculator'),
      next: async () => new Response('OK'),
    };

    const response = await onRequest(context);
    expect(response.status).toBe(301);
    expect(response.headers.get('Location')).toBe('https://calcumetrics.com/mortgage-calculator');
  });

  it('handles 304 Not Modified without throwing', async () => {
    const context = {
      request: new Request('https://preview.calcumetrics.pages.dev/asset.js'),
      next: async () => new Response(null, { status: 304, statusText: 'Not Modified' }),
    };

    const response = await onRequest(context);
    expect(response.status).toBe(304);
    expect(response.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
  });

  it('catches unhandled errors and returns 500 status with security headers', async () => {
    const context = {
      request: new Request('https://calcumetrics.com/broken-endpoint'),
      next: async () => {
        throw new Error('Unexpected crash');
      },
    };

    const response = await onRequest(context);
    expect(response.status).toBe(500);
    expect(response.headers.get('Strict-Transport-Security')).toBe('max-age=31536000; includeSubDomains');
    expect(response.headers.get('Cross-Origin-Opener-Policy')).toBe('same-origin-allow-popups');
    expect(response.headers.get('Content-Security-Policy')).toContain("default-src 'self'");
  });

  it('serves 500.html from ASSETS when next() throws and ASSETS binding exists', async () => {
    const context = {
      request: new Request('https://calcumetrics.com/broken-endpoint'),
      next: async () => {
        throw new Error('Unexpected crash');
      },
      env: {
        ASSETS: {
          fetch: async () => new Response('<html><body>Custom 500 Page</body></html>', { status: 200 }),
        },
      },
    };

    const response = await onRequest(context);
    expect(response.status).toBe(500);
    const body = await response.text();
    expect(body).toContain('Custom 500 Page');
  });

  it('passes through static asset responses untouched on custom domain', async () => {
    const originalResponse = new Response('svg-content', {
      headers: { 'Content-Type': 'image/svg+xml' },
    });
    const context = {
      request: new Request('https://calcumetrics.com/_astro/chunk.123.js'),
      next: async () => originalResponse,
    };

    const response = await onRequest(context);
    expect(response).toBe(originalResponse);
  });

  it('passes through static images like logo.svg directly on custom domain', async () => {
    const originalResponse = new Response('<svg></svg>', {
      headers: { 'Content-Type': 'image/svg+xml' },
    });
    const context = {
      request: new Request('https://calcumetrics.com/logo.svg'),
      next: async () => originalResponse,
    };

    const response = await onRequest(context);
    expect(response).toBe(originalResponse);
  });
});
