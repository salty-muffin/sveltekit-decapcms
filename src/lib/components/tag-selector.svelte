<script lang="ts">
	import type { Hast } from '$lib/types';

	export let children: Hast[];
</script>

{#each children as child}
	{#if child.type === 'element'}
		{#if child.tagName === 'img'}
			<img
				src={child.properties?.src}
				alt={child.properties?.alt}
				width={child.properties?.width}
				height={child.properties?.height}
			/>
		{:else if child.tagName === 'a'}
			<a href={child.properties?.href}><svelte:self children={child.children} /></a>
		{:else}
			<svelte:element this={child.tagName}><svelte:self children={child.children} /></svelte:element
			>
		{/if}
	{:else}
		{child.value}
	{/if}
{/each}
