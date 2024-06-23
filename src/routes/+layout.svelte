<script lang="ts">
	// global styles
	import '$lib/styles/global.scss';

	const { children } = $props();
</script>

<!-- enter "<svelte:head>" with "import { page } from '$app/stores';" here -->
{@render children()}
