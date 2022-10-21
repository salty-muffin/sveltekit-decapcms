<script lang="ts">
	import Image from '$lib/components/image.svelte';

	import type { Hast, ImageOptions } from '$lib/types';
	import { image } from 'mdast-util-to-hast/lib/handlers/image';

	export let hast: Hast | undefined;
	export let imageOptions: ImageOptions;
</script>

{#if hast && hast.children}
	{#each hast.children as child}
		{#if child.type === 'element'}
			{#if child.tagName === 'img'}
				<Image
					src={child.properties?.src}
					alt={child.properties?.alt}
					width={child.properties?.width}
					height={child.properties?.height}
					options={imageOptions}
				/>
			{:else if child.tagName === 'a'}
				<a href={child.properties?.href}><svelte:self hast={child} {imageOptions} /></a>
			{:else}
				<svelte:element this={child.tagName}>
					<svelte:self hast={child} {imageOptions} />
				</svelte:element>
			{/if}
		{:else if child.type === 'text'}
			{child.value}
		{/if}
	{/each}
{/if}
