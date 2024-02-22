<script lang="ts">
	import Image from '$lib/components/image.svelte';

	import type { Hast, ImageOptions } from '$lib/types';

	export let hast: Hast | null | undefined;
	export let imageOptions: ImageOptions;
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
				<a href={child.properties.href}><svelte:self hast={child} {imageOptions} /></a>
			{:else}
				<svelte:element this={child.tagName}
					><svelte:self hast={child} {imageOptions} /></svelte:element
				>
			{/if}
		{:else if child.type === 'text'}
			{child.value}
		{/if}
	{/each}
{/if}
