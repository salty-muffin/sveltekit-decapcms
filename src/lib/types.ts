export interface Hast {
	type: string;
	children?: Hast[];
	value?: string;
	tagName?: string;
	properties?: {
		tagName?: string;
		type?: string;
		alt?: string;
		src?: string;
		href?: string;
		width?: number;
		height?: number;
	};
}

export interface Image {
	src: string;
	width?: number;
	height?: number;
}

export interface ImageOptions {
	sizes: { width: number; maxWidth?: number }[]; // from small to large sizes. width: the width of the image; maxWidth: until which width should that image size be used. the last size doesn't need a maxWidth
	loading?: 'eager' | 'lazy';
	quality?: number;
	formats?: ('jpg' | 'png' | 'webp' | 'gif' | 'avif')[]; // fallback should come last
	aspectRatio?: number;
	query?: string;
}
