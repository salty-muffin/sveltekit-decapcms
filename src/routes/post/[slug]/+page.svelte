<script lang="ts">
	import Markdown from '$lib/components/markdown.svelte';

	import type { ImageOptions } from '$lib/types';
	import type { PageData } from './$types';

	export let data: PageData;

	const options: ImageOptions = {
		sizes: [{ width: 400, maxWidth: 400 }, { width: 640 }],
		loading: 'eager',
		quality: 80,
		formats: ['webp', 'jpg']
	};
</script>

<h1>{data.title}</h1>
<h2>{data.description}</h2>
{#if data.optional}
	<h3>{data.optional}</h3>
{/if}

<img src={data.image.src} alt="demo" width={data.image.width} height={data.image.height} />

<Markdown hast={data.body} imageOptions={options} />
