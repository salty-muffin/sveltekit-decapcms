<script lang="ts">
	import Image from '$lib/components/image.svelte';

	import type { PageData } from './$types';

	export let data: PageData;

	const imageOptions = {
		sizes: [{ width: 400, maxWidth: 400 }, { width: 640 }]
	};
</script>

<h1>{data.title}</h1>

<!-- this only gets rendered, if 'image' in the frontmatter of
	the corresponding markdown file on src/content/posts is set -->
{#if data.image}
	<Image
		src={data.image.src}
		alt="demo"
		width={data.image.width}
		height={data.image.height}
		options={imageOptions}
	/>
{/if}
