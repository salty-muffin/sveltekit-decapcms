<script lang="ts">
	import Image from '$lib/components/image.svelte';
	import Markdown from '$lib/components/markdown.svelte';

	import type { Hast, ImageOptions } from '$lib/types';

	interface MarkdownProps {
		hast: Hast | null | undefined;
		imageOptions: ImageOptions;
	}
	let { hast, imageOptions }: MarkdownProps = $props();
</script>

{#if hast && hast.children}
	{#each hast.children as child}
		{#if child.type === 'element'}
			{#if child.tagName === 'img' && child.properties && child.properties.src}
				<Image
					src={child.properties.src}
					alt={child.properties.alt}
					width={child.properties.width}
					height={child.properties.height}
					options={imageOptions}
				/>
			{:else if child.tagName === 'a' && child.properties}
				<a href={child.properties.href}><Markdown hast={child} {imageOptions} /></a>
			{:else}
				<svelte:element this={child.tagName}
					><Markdown hast={child} {imageOptions} /></svelte:element
				>
			{/if}
		{:else if child.type === 'text'}
			{child.value}
		{/if}
	{/each}
{/if}
