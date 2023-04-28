<script lang="ts">
	import type { ImageOptions, RequiredOption, PartialOption } from '$lib/types';

	interface ImageSet {
		srcset: string;
		type: string;
		sizesOption: string;
	}

	export let src: string | undefined;
	export let width: number | undefined;
	export let height: number | undefined;
	export let alt: string | undefined;
	export let options: ImageOptions;
	const optionsDefault: RequiredOption<
		PartialOption<ImageOptions, 'sizes'>,
		'loading' | 'quality' | 'formats'
	> = {
		loading: 'eager',
		quality: 80,
		formats: ['webp', 'jpg']
	};

	const {
		sizes: sizesOption,
		loading,
		quality,
		formats,
		aspectRatio,
		query
	}: RequiredOption<ImageOptions, 'loading' | 'quality' | 'formats'> = Object.assign(
		{},
		optionsDefault,
		options
	);

	let className = '';
	export { className as class };

	let images: ImageSet[] = [];
	// create a srcset, type & sizesOption for each format
	let sizes = '';
	sizesOption.forEach((size, index) => {
		if (index < sizesOption.length - 1)
			sizes += `(max-width: ${size.maxWidth}px) ${size.width}px, `;
		else sizes += `${size.width}px`;
	});
	formats.forEach((format) => {
		let srcset = '';
		sizesOption.forEach((size, index) => {
			srcset += `${src}@w=${size.width}+${aspectRatio ? `h=${Math.round(size.width / aspectRatio)}+` : ''}${
				query ? `${query}+` : ''
			}fm=${format}+q=${quality}.${format} ${size.width}w`;
			if (index < sizesOption.length - 1) srcset += ', ';
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
		images.push({ srcset: srcset, type: type, sizesOption: sizes });
	});
</script>

{#if src}
	<picture>
		{#each images as image}
			<source srcset={image.srcset} sizes={image.sizesOption} type={image.type} />
		{/each}
		<img
			class="image-component {className}"
			{loading}
			src="{src}@w={sizesOption[sizesOption.length - 1].width}+{aspectRatio
				? `h=${Math.round(sizesOption[sizesOption.length - 1].width / aspectRatio)}+`
				: ''}{query ? `${query}+` : ''}fm={formats[formats.length - 1]}+q={quality}.{formats[
				formats.length - 1
			]}"
			{alt}
			{width}
			height={aspectRatio ? width && Math.round(width / aspectRatio) : height}
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
