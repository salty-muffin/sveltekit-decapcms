import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import fs from 'fs';
import fm from 'front-matter';
import { getImageProperties } from '$lib/image';

interface Demo {
	title: string;
	image?: string;
}

export const load: PageServerLoad = async ({ params }) => {
	try {
		const post = fm<Demo>(fs.readFileSync(`src/content/posts/${params.slug}.md`, 'utf-8'));

		console.log(`[info] processing markdown src/content/${params.slug}.md`);

		if (post) {
			return {
				title: post.attributes.title,
				image: post.attributes.image && await getImageProperties(post.attributes.image),
			};
		}
		error(500, 'something wrong with the markdown file');
	} catch {
		error(404, 'not found');
	}
};
