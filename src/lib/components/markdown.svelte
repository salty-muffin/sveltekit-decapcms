<script lang="ts">
	import type { Hast } from '$lib/types';

	export let hast: Hast | undefined;
</script>

{#if hast && hast.children}
	{#each hast.children as child}
		{#if child.type === 'element'}
			{#if child.tagName === 'img'}
				<img
					src={child.properties?.src}
					alt={child.properties?.alt}
					width={child.properties?.width}
					height={child.properties?.height}
				/>
			{:else if child.tagName === 'a'}
				<a href={child.properties?.href}><svelte:self hast={child} /></a>
			{:else}
				<svelte:element this={child.tagName}>
					<svelte:self hast={child} />
				</svelte:element>
			{/if}
		{:else if child.type === 'text'}
			{child.value}
		{/if}
	{/each}
{/if}
