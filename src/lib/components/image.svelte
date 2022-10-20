<script lang="ts">
	import type { ImageOptions } from '$lib/types';

	interface ImageSet {
		srcset: string;
		type: string;
		sizes: string;
	}

	export let src: string | undefined;
	export let width: number | undefined;
	export let height: number | undefined;
	export let alt: string | undefined;
	export let options: ImageOptions;
	let className = '';
	export { className as class };

	let images: ImageSet[] = [];
	// create a srcset, type & sizes for each format
	let sizes_ = '';
	options.sizes.forEach((size, index) => {
		if (index < options.sizes.length - 1)
			sizes_ += `(max-width: ${size.maxWidth}px) ${size.width}px, `;
		else sizes_ += `${size.width}px`;
	});
	options.formats.forEach((format) => {
		let srcset = '';
		options.sizes.forEach((size, index) => {
			srcset += `${src}@w=${size.width}+${
				options.aspectRatio ? `h=${size.width / options.aspectRatio}+` : ''
			}${options.query ? `${options.query}+` : ''}fm=${format}+q=${options.quality}.${format} ${
				size.width
			}w`;
			if (index < options.sizes.length - 1) srcset += ', ';
		});

		let type = '';
		switch (format) {
			case 'jpg':
				type = 'image/jpeg';
				break;
			case 'png':
				type = 'image/png';
				break;
			case 'webp':
				type = 'image/webp';
				break;
			case 'gif':
				type = 'image/gif';
				break;
			case 'avif':
				type = 'image/avif';
				break;
		}
		images.push({ srcset: srcset, type: type, sizes: sizes_ });
	});
</script>

{#if src}
	<picture>
		{#each images as image}
			<source srcset={image.srcset} sizes={image.sizes} type={image.type} />
		{/each}
		<img
			class="image-component {className}"
			loading={options.loading}
			src="{src}@w={options.sizes[options.sizes.length - 1].width}+{options.aspectRatio
				? `h=${options.sizes[options.sizes.length - 1].width / options.aspectRatio}+`
				: ''}{options.query ? `${options.query}+` : ''}fm={options.formats[
				options.formats.length - 1
			]}+q={options.quality}.{options.formats[options.formats.length - 1]}"
			{alt}
			{width}
			height={options.aspectRatio ? width && width / options.aspectRatio : height}
			on:load
		/>
	</picture>
{/if}

<style global>
	.image-component {
		display: block;
		/* width: 100%;
		height: auto; */
	}
</style>
