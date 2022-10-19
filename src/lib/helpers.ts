import sharp from 'sharp';

import type { HastNode } from 'mdast-util-to-hast/lib';
import type { Hast, Image } from '$lib/types';

export const reduceHast = (hast: HastNode): Hast => {
	// remove all unnessesary elements from hast (like position, properties or newlines)
	return {
		type: hast.type,
		...('children' in hast && {
			children: hast.children
				.filter(
					(child: HastNode) => !('value' in child) || ('value' in child && child.value !== '\n')
				)
				.map((child: HastNode) => reduceHast(child))
		}),
		...('value' in hast && { value: hast.value }),
		...('tagName' in hast && { tagName: hast.tagName }),
		...('properties' in hast && { properties: hast.properties })
	};
};

export const addImagePropertiesToHast = async (hast: Hast): Promise<Hast> => {
	if ('tagName' in hast && hast.tagName === 'img') {
		const metadata = await sharp(`src/${hast.properties?.src}`).metadata();

		hast.properties = {
			...(hast.properties ? hast.properties : {}),
			width: metadata.width,
			height: metadata.height
		};
	}
	if (hast.children) {
		hast.children = await Promise.all(
			hast.children?.map(async (child) => await addImagePropertiesToHast(child))
		);
	}
	return hast;
};

export const getImageProperties = async (path: string): Promise<Image> => {
	const metadata = await sharp(`src/${path}`).metadata();

	return { src: path, width: metadata.width, height: metadata.height };
};
