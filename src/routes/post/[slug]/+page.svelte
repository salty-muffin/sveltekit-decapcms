<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	console.log(data.body);
</script>

<h1>{data.title}</h1>
<h2>{data.description}</h2>

<img src={data.image} alt="demo" />
