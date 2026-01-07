// Color type definitions

export interface RGB {
	r: number;
	g: number;
	b: number;
}

export interface HSL {
	h: number;
	s: number;
	l: number;
}

export interface CMYK {
	c: number;
	m: number;
	y: number;
	k: number;
}

export interface Color {
	id: string;
	projectId: string;
	hex: string;
	rgb: RGB;
	hsl: HSL;
	name?: string;
	notes?: string;
	position: number;
	source: 'picker' | 'image' | 'manual';
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateColorInput {
	projectId: string;
	hex: string;
	name?: string;
	notes?: string;
	source: 'picker' | 'image' | 'manual';
}

export interface UpdateColorInput {
	hex?: string;
	name?: string;
	notes?: string;
	position?: number;
}
