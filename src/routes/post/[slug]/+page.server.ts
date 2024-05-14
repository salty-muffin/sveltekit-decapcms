import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import fs from 'fs';
import fm from 'front-matter';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toHast } from 'mdast-util-to-hast';
import { getImageProperties, addImagePropertiesToHast, reduceHast } from '$lib/markdown';

interface Demo {
	title: string;
	description: string;
	image: string;
	draft: boolean;
	optional?: string;
}

export const load: PageServerLoad = async ({ params }) => {
	try {
		const post = fm<Demo>(fs.readFileSync(`src/content/posts/${params.slug}.md`, 'utf-8'));

		console.log(`processing markdown src/content/${params.slug}.md`);

		if (post) {
			const hast = toHast(fromMarkdown(post.body));

			return {
				title: post.attributes.title,
				description: post.attributes.description,
				image: await getImageProperties(post.attributes.image),
				optional: post.attributes.optional,
				body: hast && (await addImagePropertiesToHast(reduceHast(hast)))
			};
		}
		error(500, 'something wrong with the markdown file');
	} catch (err){
		console.error(err)
		error(404, 'not found');
	}
};
