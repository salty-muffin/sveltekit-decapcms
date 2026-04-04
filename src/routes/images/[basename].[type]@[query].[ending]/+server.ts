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

		console.log(
			`processing image src/images/${path}.${params.type}@${params.query}.${params.ending}`
		);

		// process query with the format '@p1=v1+p2=v2'
		const queries = params.query.split('+');
		let width: number | null = null;
		let height: number | null = null;
		let position = sharp.gravity.center;
		let format: string | null = null;
		let quality = 80;
		for (const query of queries) {
			switch (query.split('=')[0]) {
				// width
				case 'w': {
					const w = Number(query.split('=')[1]);
					if (isNaN(w) || w <= 0) error(400, 'invalid width');
					width = w;
					break;
				}
				// height
				case 'h': {
					const h = Number(query.split('=')[1]);
					if (isNaN(h) || h <= 0) error(400, 'invalid height');
					height = h;
					break;
				}
				// position
				case 'p':
					if (query.split('=')[1] === 'entropy') position = sharp.strategy.entropy;
					else if (query.split('=')[1] === 'attention') position = sharp.strategy.attention;
					break;
				// format
				case 'fm':
					format = query.split('=')[1];
					break;
				// quality
				case 'q': {
					const q = Number(query.split('=')[1]);
					if (isNaN(q) || q <= 0 || q > 100) error(400, 'invalid quality');
					quality = q;
					break;
				}
				default:
					error(500, 'unrecognized image query');
			}
		}

		// transform the image
		let transformedImage = image.rotate();
		if (width || height)
			transformedImage = transformedImage.resize(width, height, { position: position });
		let type = `image/${(await image.metadata()).format}`;
		if (format) {
			switch (format) {
				case 'jpg':
				case 'jpeg':
					type = 'image/jpeg';
					transformedImage = transformedImage.jpeg({ quality: quality });
					break;
				case 'png':
					type = 'image/png';
					transformedImage = transformedImage.png();
					break;
				case 'webp':
					type = 'image/webp';
					transformedImage = transformedImage.webp({ quality: quality });
					break;
				case 'gif':
					type = 'image/gif';
					transformedImage = transformedImage.gif();
					break;
				case 'avif':
					type = 'image/avif';
					transformedImage = transformedImage.avif({ quality: quality });
					break;
				default:
					error(500, 'unrecognized image format');
			}
		}

		const buffer = await transformedImage.toBuffer();
		return new Response(new Uint8Array(buffer), { headers: { 'Content-Type': type } });
	} catch (err) {
		console.error(err);
		error(404, 'not found');
	}
};
