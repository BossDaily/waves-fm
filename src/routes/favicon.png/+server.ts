import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	// Redirect to the dynamic favicon API
	throw redirect(302, '/api/favicon');
};
