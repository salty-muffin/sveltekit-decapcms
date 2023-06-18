import sharp from 'sharp';

import type { Hast, Image } from '$lib/types';

export const reduceHast = (hast: Hast): Hast => {
	// remove all unnessesary elements from hast (like position, properties or newlines) so no unnecessary information gets built
	return {
		type: hast.type,
		...(hast.children && {
			children: hast.children
				.filter((child: Hast) => !child.value || child.value !== '\n')
				.map((child: Hast) => reduceHast(child))
		}),
		...(hast.value && { value: hast.value }),
		...(hast.tagName && { tagName: hast.tagName }),
		...(hast.properties && { properties: hast.properties })
	};
};

export const addImagePropertiesToHast = async (hast: Hast): Promise<Hast> => {
	if (hast.tagName === 'img' && hast.properties) {
		let width;
		let height;
		try {
			const metadata = await sharp(`src/${hast.properties.src}`).metadata();
			width = metadata.width;
			height = metadata.height;
		} catch {
			console.log(`[warning] could not open src/${hast.properties.src}`);
		}

		hast.properties = {
			...(hast.properties ? hast.properties : {}),
			width: width,
			height: height
		};
	}
	if (hast.children) {
		hast.children = await Promise.all(
			hast.children.map(async (child) => await addImagePropertiesToHast(child))
		);
	}
	return hast;
};

export const getImageProperties = async (path: string): Promise<Image> => {
	let width;
	let height;
	try {
		const metadata = await sharp(`src/${path}`).metadata();
		width = metadata.width;
		height = metadata.height;
	} catch {
		console.log(`[warning] could not open src/${path}`);
	}

	return { src: path, width: width, height: height };
};
