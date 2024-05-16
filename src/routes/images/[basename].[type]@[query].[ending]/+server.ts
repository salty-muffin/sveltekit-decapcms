import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import sharp from 'sharp';

export const prerender = 'auto';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const path = decodeURI(params.basename);

		const image = sharp(`src/images/${path}.${params.type}`);

		console.log(
			`processing image src/images/${path}.${params.type}@${params.query}.${params.ending}`
		);

		if (!image) {
			error(500, 'image could not be opened properly');
		}

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
				case 'w':
					width = Number(query.split('=')[1]);
					break;
				// height
				case 'h':
					height = Number(query.split('=')[1]);
					break;
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
				case 'q':
					quality = Number(query.split('=')[1]);
					break;
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

		return new Response(await transformedImage.toBuffer(), { headers: { 'Content-Type': type } });
	} catch (err) {
		console.error(err);
		error(404, 'not found');
	}
};
