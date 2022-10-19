<script lang="ts">
	import TagSelector from './tag-selector.svelte';

	import type { Hast } from '$lib/types';

	export let hast: Hast | undefined;
</script>

{#if hast && hast.children}
	<TagSelector children={hast.children} />
{/if}
