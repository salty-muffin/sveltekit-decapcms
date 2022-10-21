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
