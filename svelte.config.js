import adapter from '@sveltejs/adapter-static';
import { sveltePreprocess } from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: sveltePreprocess({
		scss: {
			// We can use a path relative to the root because
			// svelte-preprocess automatically adds it to `includePaths`
			// if none is defined.
			prependData: `@use "sass:map"; @use "sass:color"; @use 'src/lib/styles/variables.scss' as *;`
		}
	}),
	kit: {
		adapter: adapter({ fallback: '404.html', strict: false }),
		prerender: {
			entries: ['/']
		}
	}
};

export default config;