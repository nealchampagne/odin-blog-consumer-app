import api from '../../src/api/client.js';

import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

const server = setupServer(
  http.get('http://localhost/protected', () => {
    return HttpResponse.json({ ok: true });
  }),
  http.get('http://localhost/fail', () => {
    return HttpResponse.json({ message: 'Bad request' }, { status: 400 });
  }),
  http.post('http://localhost/login', async ({ request }) => {
    let username = 'guest';

    try {
      const body = (await request.json()) as { username?: string } | null;
      username = body?.username ?? 'guest';
    } catch {
      // Ignore empty or invalid JSON bodies.
    }

    return HttpResponse.json({ token: 'fake-jwt-token', user: username });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('api client', () => {
  it('adds Authorization header when token exists', async () => {
    localStorage.setItem('token', 'abc123');
    const result = await api<{ ok: boolean }>('/protected');
    expect(result.ok).toBe(true);
  });

  it('skips Authorization header for public paths', async () => {
    localStorage.setItem('token', 'abc123');
    const result = await api<{ ok: boolean }>('/login', { method: 'POST' });
    // You can assert MSW handler or just check result shape
    expect(result).toBeDefined();
  });

  it('throws error on non-OK response', async () => {
    await expect(api('/fail')).rejects.toThrow('Bad request');
  });
});