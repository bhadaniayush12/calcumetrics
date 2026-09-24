interface PagesContext {
  request: Request;
  next: () => Promise<Response>;
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const response = await context.next();
  const url = new URL(context.request.url);

  // If request is on a pages.dev hostname (preview/staging), add noindex, nofollow
  if (url.hostname.includes('pages.dev')) {
    const newHeaders = new Headers(response.headers);
    newHeaders.set('X-Robots-Tag', 'noindex, nofollow');

    return new Response([204, 205, 304].includes(response.status) ? null : response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  }

  return response;
}
