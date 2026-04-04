import sharp from 'sharp';

import type { Nodes, ElementContent, RootContent } from 'hast';
import type { Image } from '$lib/types';

export const reduceHast = (node: Nodes): Nodes => {
	// remove all unnecessary elements from hast (like position, properties or newlines) so no unnecessary information gets built
	switch (node.type) {
		case 'element':
			return {
				type: 'element',
				tagName: node.tagName,
				properties: node.properties,
				children: node.children
					.filter((child) => !(child.type === 'text' && child.value === '\n'))
					.map((child) => reduceHast(child) as ElementContent)
			};
		case 'root':
			return {
				type: 'root',
				children: node.children
					.filter((child) => !(child.type === 'text' && child.value === '\n'))
					.map((child) => reduceHast(child) as RootContent)
			};
		case 'text':
			return { type: 'text', value: node.value };
		case 'comment':
			return { type: 'comment', value: node.value };
		case 'doctype':
			return { type: 'doctype' };
		default:
			return node;
	}
};

export const getImageProperties = async (path: string): Promise<Image> => {
	let width = undefined;
	let height = undefined;
	try {
		const metadata = await sharp(`src/${path}`).metadata();
		width = !metadata.orientation || metadata.orientation <= 4 ? metadata.width : metadata.height;
		height = !metadata.orientation || metadata.orientation <= 4 ? metadata.height : metadata.width;
	} catch {
		console.warn(`could not open src/${path}`);
	}

	return { src: encodeURI(path), width, height };
};

export const addImagePropertiesToHast = async (node: Nodes): Promise<Nodes> => {
	if (node.type === 'element') {
		if (node.tagName === 'img' && node.properties?.src) {
			node.properties = {
				...(node.properties ?? {}),
				...(await getImageProperties(String(node.properties.src)))
			};
		}
		node.children = (await Promise.all(
			node.children.map(async (child) => await addImagePropertiesToHast(child))
		)) as ElementContent[];
	} else if (node.type === 'root') {
		node.children = (await Promise.all(
			node.children.map(async (child) => await addImagePropertiesToHast(child))
		)) as RootContent[];
	}
	return node;
};
