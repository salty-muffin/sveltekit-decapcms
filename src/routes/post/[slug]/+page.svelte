<script lang="ts">
	import Markdown from '$lib/components/markdown.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>{data.title}</h1>
<h2>{data.description}</h2>

<img src={data.image.src} alt="demo" width={data.image.width} height={data.image.height} />

<Markdown hast={data.body} />
