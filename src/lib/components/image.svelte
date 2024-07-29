<script lang="ts">
	import type { ImageOptions, RequiredOption, PartialOption } from '$lib/types';

	interface ImageSet {
		srcset: string;
		sizesOption: string;
	}

	interface ImageProps {
		src: string;
		width?: number;
		height?: number;
		alt?: string;
		className?: string;
		options: ImageOptions;
		props?: {
			[x: string]: unknown;
		};
	}
	let {
		src,
		width = 0,
		height = 0,
		alt = '',
		options,
		className = '',
		...props
	}: ImageProps = $props();

	const optionsDefault: RequiredOption<PartialOption<ImageOptions, 'sizes'>, 'quality'> = {
		quality: 75
	};

	const {
		sizes: sizesOption,
		quality,
		aspectRatio
	}: RequiredOption<ImageOptions, 'quality'> = Object.assign({}, optionsDefault, options);

	let images: ImageSet[] = [];
	// create a srcset, type & sizesOption for each format
	let sizes = '';
	sizesOption.forEach((size, index) => {
		if (index < sizesOption.length - 1)
			sizes += `(max-width: ${size.maxWidth}px) ${size.width}px, `;
		else sizes += `${size.width}px`;
	});
	let srcset = '';
	sizesOption.forEach((size, index) => {
		srcset += `/.netlify/images?url=${src}&w=${size.width}${
			aspectRatio ? `&h=${Math.round(size.width / aspectRatio)}&fit=cover` : ''
		}&q=${quality} ${size.width}w`;
		if (index < sizesOption.length - 1) srcset += ', ';
	});
	images.push({ srcset: srcset, sizesOption: sizes });
</script>

{#if src}
	<picture>
		{#each images as image}
			<source srcset={image.srcset} sizes={image.sizesOption} />
		{/each}
		<img
			class="image-component {className}"
			{...props}
			src="/.netlify/images?url={src}&w={sizesOption[sizesOption.length - 1].width}{aspectRatio
				? `&h=${Math.round(sizesOption[sizesOption.length - 1].width / aspectRatio)}&fit=cover`
				: ''}&q={quality}"
			{alt}
			{width}
			height={aspectRatio ? width && Math.round(width / aspectRatio) : height}
		/>
	</picture>
{/if}

<style global>
	.image-component {
		display: block;
		width: 100%;
		height: auto;
	}
</style>
