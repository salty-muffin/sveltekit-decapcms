import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import sharp from 'sharp';

export const prerender = true;

export const GET: RequestHandler = async ({ params }) => {
	try {
		const path = decodeURI(params.path);

		const image = sharp(`src/images/${path}.${params.type}`);

		console.log(`[info] processing image src/images/${path}.${params.type}`);

		if (image) {
			return new Response(await image.toBuffer(), {
				headers: { 'Content-Type': `image/${(await image.metadata()).format}` }
			});
		}
		error(500, 'image could not be opened properly');
	} catch {
		error(404, 'not found');
	}
};
