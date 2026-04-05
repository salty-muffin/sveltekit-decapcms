<script lang="ts">
	import Image from '$lib/components/image.svelte';
	import Markdown from '$lib/components/markdown.svelte';

	import type { Nodes, Properties } from 'hast';
	import type { ImageOptions } from '$lib/types';

	interface MarkdownProps {
		hast: Nodes | null | undefined;
		imageOptions: ImageOptions;
	}
	let { hast, imageOptions }: MarkdownProps = $props();

	function str(val: Properties[string]): string | undefined {
		return typeof val === 'string' ? val : undefined;
	}

	function num(val: Properties[string]): number | undefined {
		return typeof val === 'number' ? val : undefined;
	}
</script>

{#if hast && (hast.type === 'element' || hast.type === 'root')}
	{#each hast.children as child}
		{#if child.type === 'element'}
			{#if child.tagName === 'img' && child.properties.src}
				<Image
					src={str(child.properties.src) ?? ''}
					alt={str(child.properties.alt)}
					width={num(child.properties.width)}
					height={num(child.properties.height)}
					options={imageOptions}
				/>
			{:else if child.tagName === 'a'}
				<a href={str(child.properties.href)}><Markdown hast={child} {imageOptions} /></a>
			{:else if child.tagName === 'br'}
				<br />
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
