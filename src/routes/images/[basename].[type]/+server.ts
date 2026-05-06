import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import sharp from 'sharp';

const ALLOWED_TYPES = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'tiff', 'svg']);

export const prerender = 'auto';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const path = decodeURI(params.basename);

		if (
			path.includes('..') ||
			path.includes('\0') ||
			path.startsWith('/') ||
			path.includes('%2e') ||
			path.includes('%2E')
		) {
			error(400, 'invalid path');
		}

		if (!ALLOWED_TYPES.has(params.type.toLowerCase())) {
			error(400, 'invalid image type');
		}

		const image = sharp(`src/images/${path}.${params.type}`);

		console.log(`processing image src/images/${path}.${params.type}`);

		const buffer = await image.toColorspace('srgb').toBuffer();
		return new Response(new Uint8Array(buffer), {
			headers: { 'Content-Type': `image/${(await image.metadata()).format}` }
		});
	} catch (err) {
		console.error(err);
		error(404, 'not found');
	}
};
