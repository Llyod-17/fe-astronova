import { json, type RequestHandler } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

const BE = env.BE_API_URL || 'http://127.0.0.1:8000/api';

export const fallback: RequestHandler = async ({ params, request, url, cookies }) => {
	const path = params.path ?? '';
	const method = request.method;
	const target = `${BE}/${path}${url.search}`;

	const headers: Record<string, string> = { Accept: 'application/json' };

	const ct = request.headers.get('content-type');
	if (ct) headers['content-type'] = ct;

	let body: BodyInit | undefined;
	if (method !== 'GET' && method !== 'HEAD') {
		body = await request.arrayBuffer();
	}

	const token = cookies.get('astro_token');
	if (token) headers.Authorization = `Bearer ${token}`;

	const res = await fetch(target, { method, headers, body });

	if (method === 'POST' && path === 'login' && res.ok) {
		const data = await res.json();
		const tok = data?.data?.token;
		if (tok) {
			cookies.set('astro_token', tok, {
				httpOnly: true,
				sameSite: 'lax',
				path: '/',
				maxAge: 60 * 60 * 24 * 7,
				secure: !dev
			});
			return json(data, { status: res.status });
		}
		return json(data, { status: res.status });
	}

	if (method === 'POST' && path === 'logout') {
		cookies.delete('astro_token', { path: '/' });
	}

	const respBody = await res.arrayBuffer();
	return new Response(respBody, {
		status: res.status,
		headers: { 'content-type': res.headers.get('content-type') || 'application/json' }
	});
};