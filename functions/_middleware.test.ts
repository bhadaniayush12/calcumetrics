import { describe, expect, it } from 'vitest';
import { onRequest } from './_middleware';

describe('Cloudflare Pages _middleware', () => {
  it('adds X-Robots-Tag: noindex, nofollow on pages.dev hostname', async () => {
    const context = {
      request: new Request('https://calcumetrics.pages.dev/'),
      next: async () => new Response('OK', {
        headers: { 'X-Content-Type-Options': 'nosniff' },
      }),
    };

    const response = await onRequest(context);
    expect(response.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
  });

  it('adds X-Robots-Tag on branch preview pages.dev subdomains', async () => {
    const context = {
      request: new Request('https://8703423f.calcumetrics.pages.dev/sip-calculator/'),
      next: async () => new Response('OK'),
    };

    const response = await onRequest(context);
    expect(response.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
  });

  it('does NOT add X-Robots-Tag on custom production domain calcumetrics.com', async () => {
    const context = {
      request: new Request('https://calcumetrics.com/sip-calculator/'),
      next: async () => new Response('OK', {
        headers: { 'X-Content-Type-Options': 'nosniff' },
      }),
    };

    const response = await onRequest(context);
    expect(response.headers.get('X-Robots-Tag')).toBeNull();
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
  });

  it('does NOT add X-Robots-Tag on www.calcumetrics.com', async () => {
    const context = {
      request: new Request('https://www.calcumetrics.com/'),
      next: async () => new Response('OK'),
    };

    const response = await onRequest(context);
    expect(response.headers.get('X-Robots-Tag')).toBeNull();
  });

  it('handles 304 Not Modified without throwing', async () => {
    const context = {
      request: new Request('https://calcumetrics.pages.dev/asset.js'),
      next: async () => new Response(null, { status: 304, statusText: 'Not Modified' }),
    };

    const response = await onRequest(context);
    expect(response.status).toBe(304);
    expect(response.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
  });
});
