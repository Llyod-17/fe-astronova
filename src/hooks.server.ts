import { redirect, json, type Handle } from '@sveltejs/kit';

const PUBLIC_PAGES = ['/login', '/register'];
const PUBLIC_API = '/api/login';

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;
	const token = event.cookies.get('astro_token');
	const isApi = pathname.startsWith('/api/');

	if (isApi) {
		if (pathname === PUBLIC_API) return resolve(event);
		if (!token) return json({ success: false, message: 'Unauthenticated.', errors: {} }, { status: 401 });
		return resolve(event);
	}

	if (PUBLIC_PAGES.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
		return resolve(event);
	}

	if (!token) throw redirect(303, '/login');

	return resolve(event);
};