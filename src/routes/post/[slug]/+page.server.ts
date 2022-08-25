import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import fs from 'fs';
import fm from 'front-matter';
import { fromMarkdown } from 'mdast-util-from-markdown';
// import { toHast } from 'mdast-util-to-hast';

interface Demo {
	title: string;
	description: string;
	image: string;
	draft: boolean;
}

export const load: PageServerLoad = async ({ params }) => {
	try {
		const post = fm<Demo>(fs.readFileSync(`src/content/${params.slug}.md`, 'utf-8'));

		console.log(`[info] processing markdown src/content/${params.slug}.md`);

		if (post) {
			return {
				title: post.attributes.title,
				description: post.attributes.description,
				image: post.attributes.image,
				// body: toHast(fromMarkdown(post.body))
				body: fromMarkdown(post.body)
			};
		}
		throw error(500, 'something wrong with the markdown file');
	} catch {
		throw error(404, 'not found');
	}
};
