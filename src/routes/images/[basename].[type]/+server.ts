import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import sharp from 'sharp';

export const prerender = 'auto';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const path = decodeURI(params.basename);

		const image = sharp(`src/images/${path}.${params.type}`);

		console.log(`processing image src/images/${path}.${params.type}`);

		if (image) {
			return new Response(await image.toBuffer(), {
				headers: { 'Content-Type': `image/${(await image.metadata()).format}` }
			});
		}
		error(500, 'image could not be opened properly');
	} catch (err) {
		console.error(err);
		error(404, 'not found');
	}
};
