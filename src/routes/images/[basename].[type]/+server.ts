import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import sharp from 'sharp';

export const prerender = 'auto';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const path = decodeURI(params.basename);

		if (path.includes('..')) {
			error(400, 'invalid path');
		}

		const image = sharp(`src/images/${path}.${params.type}`);

		console.log(`processing image src/images/${path}.${params.type}`);

		const buffer = await image.toBuffer();
		return new Response(new Uint8Array(buffer), {
			headers: { 'Content-Type': `image/${(await image.metadata()).format}` }
		});
	} catch (err) {
		console.error(err);
		error(404, 'not found');
	}
};
