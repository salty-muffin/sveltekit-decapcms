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
	sizes: { width: number; maxWidth?: number }[];
	loading: 'eager' | 'lazy';
	quality: number;
	formats: ('jpg' | 'png' | 'webp' | 'gif' | 'avif')[];
	aspectRatio?: number;
	query?: string;
}
