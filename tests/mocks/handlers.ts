import { http } from 'msw';

export const handlers = [
  http.get('http://localhost/protected', () => {
    return Response.json({ ok: true });
  }),

  http.get('http://localhost/fail', () => {
    return new Response(JSON.stringify({ message: 'Bad request' }), { status: 400 });
  }),

  http.post('http://localhost/login', async ({ request }) => {
    const body = (await request.json()) as { username?: string } | null;
    const username = body?.username ?? 'guest';

    return Response.json({ token: 'fake-jwt-token', user: username });
  }),
];