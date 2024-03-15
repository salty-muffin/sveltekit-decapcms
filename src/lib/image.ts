import sharp from 'sharp';

import type { Image } from '$lib/types';

export const getImageProperties = async (path: string): Promise<Image> => {
	let width = undefined;
	let height = undefined;
	try {
		const metadata = await sharp(`src/${path}`).metadata();
		width = !metadata.orientation || metadata.orientation <= 4 ? metadata.width : metadata.height;
		height = !metadata.orientation || metadata.orientation <= 4 ? metadata.height : metadata.width;
	} catch {
		console.warn(`[warning] could not open src/${path}`);
	}

	return { src: path, width: width, height: height };
};
