<script lang="ts">
	interface ImageSet {
		srcset: string;
		type: string;
		sizes: string;
	}

	interface ImageOptions {
		sizes: { width: number; maxWidth?: number }[]; // from small to large sizes. width: the width of the image; maxWidth: until which width should that image size be used. the last size doesn't need a maxWidth
		loading: 'eager' | 'lazy';
		quality: number;
		formats: ('jpg' | 'png' | 'webp' | 'gif' | 'avif')[]; // fallback should come last
		aspectRatio?: number;
		query?: string;
	}

	type PartialOption<T, K extends keyof T> = Partial<Pick<T, K>> & Pick<T, Exclude<keyof T, K>>;

	export let src: string | undefined;
	export let width: number | undefined;
	export let height: number | undefined;
	export let alt: string | undefined;
	export let options: PartialOption<ImageOptions, 'loading' | 'quality' | 'formats'>;
	const optionsDefault: PartialOption<ImageOptions, 'sizes'> = {
		loading: 'eager',
		quality: 80,
		formats: ['webp', 'jpg']
	};

	const _options: ImageOptions = Object.assign({}, optionsDefault, options);

	let className = '';
	export { className as class };

	let images: ImageSet[] = [];
	// create a srcset, type & sizes for each format
	let sizes_ = '';
	_options.sizes.forEach((size, index) => {
		if (index < _options.sizes.length - 1)
			sizes_ += `(max-width: ${size.maxWidth}px) ${size.width}px, `;
		else sizes_ += `${size.width}px`;
	});
	_options.formats.forEach((format) => {
		let srcset = '';
		_options.sizes.forEach((size, index) => {
			srcset += `${src}@w=${size.width}+${
				_options.aspectRatio ? `h=${size.width / _options.aspectRatio}+` : ''
			}${_options.query ? `${_options.query}+` : ''}fm=${format}+q=${_options.quality}.${format} ${
				size.width
			}w`;
			if (index < _options.sizes.length - 1) srcset += ', ';
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
			loading={_options.loading}
			src="{src}@w={_options.sizes[_options.sizes.length - 1].width}+{_options.aspectRatio
				? `h=${_options.sizes[_options.sizes.length - 1].width / _options.aspectRatio}+`
				: ''}{_options.query ? `${_options.query}+` : ''}fm={_options.formats[
				_options.formats.length - 1
			]}+q={_options.quality}.{_options.formats[_options.formats.length - 1]}"
			{alt}
			{width}
			height={_options.aspectRatio ? width && width / _options.aspectRatio : height}
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
