// Color conversion utilities

import type { RGB, HSL, CMYK } from '../types';

/**
 * Validates a hex color string
 */
export function isValidHex(hex: string): boolean {
	return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * Normalizes a hex color to 6-digit format with # prefix
 */
export function normalizeHex(hex: string): string {
	let normalized = hex.replace('#', '');

	if (normalized.length === 3) {
		normalized = normalized
			.split('')
			.map((c) => c + c)
			.join('');
	}

	return `#${normalized.toUpperCase()}`;
}

/**
 * Converts HEX to RGB
 */
export function hexToRgb(hex: string): RGB {
	const normalized = normalizeHex(hex).replace('#', '');
	const r = Number.parseInt(normalized.slice(0, 2), 16);
	const g = Number.parseInt(normalized.slice(2, 4), 16);
	const b = Number.parseInt(normalized.slice(4, 6), 16);
	return { r, g, b };
}

/**
 * Converts RGB to HEX
 */
export function rgbToHex(rgb: RGB): string {
	const toHex = (n: number) => {
		const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
		return hex.length === 1 ? `0${hex}` : hex;
	};
	return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}

/**
 * Converts RGB to HSL
 */
export function rgbToHsl(rgb: RGB): HSL {
	const r = rgb.r / 255;
	const g = rgb.g / 255;
	const b = rgb.b / 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const l = (max + min) / 2;

	if (max === min) {
		return { h: 0, s: 0, l: Math.round(l * 100) };
	}

	const d = max - min;
	const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

	let h = 0;
	switch (max) {
		case r:
			h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
			break;
		case g:
			h = ((b - r) / d + 2) / 6;
			break;
		case b:
			h = ((r - g) / d + 4) / 6;
			break;
	}

	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		l: Math.round(l * 100),
	};
}

/**
 * Converts HSL to RGB
 */
export function hslToRgb(hsl: HSL): RGB {
	const h = hsl.h / 360;
	const s = hsl.s / 100;
	const l = hsl.l / 100;

	if (s === 0) {
		const gray = Math.round(l * 255);
		return { r: gray, g: gray, b: gray };
	}

	const hue2rgb = (p: number, q: number, t: number) => {
		let tt = t;
		if (tt < 0) tt += 1;
		if (tt > 1) tt -= 1;
		if (tt < 1 / 6) return p + (q - p) * 6 * tt;
		if (tt < 1 / 2) return q;
		if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
		return p;
	};

	const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	const p = 2 * l - q;

	return {
		r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
		g: Math.round(hue2rgb(p, q, h) * 255),
		b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
	};
}

/**
 * Converts HEX to HSL
 */
export function hexToHsl(hex: string): HSL {
	return rgbToHsl(hexToRgb(hex));
}

/**
 * Converts HSL to HEX
 */
export function hslToHex(hsl: HSL): string {
	return rgbToHex(hslToRgb(hsl));
}

/**
 * Converts RGB to CMYK
 */
export function rgbToCmyk(rgb: RGB): CMYK {
	const r = rgb.r / 255;
	const g = rgb.g / 255;
	const b = rgb.b / 255;

	const k = 1 - Math.max(r, g, b);

	if (k === 1) {
		return { c: 0, m: 0, y: 0, k: 100 };
	}

	return {
		c: Math.round(((1 - r - k) / (1 - k)) * 100),
		m: Math.round(((1 - g - k) / (1 - k)) * 100),
		y: Math.round(((1 - b - k) / (1 - k)) * 100),
		k: Math.round(k * 100),
	};
}

/**
 * Converts HEX to CMYK
 */
export function hexToCmyk(hex: string): CMYK {
	return rgbToCmyk(hexToRgb(hex));
}

/**
 * Gets the relative luminance of a color (for contrast calculations)
 */
export function getLuminance(rgb: RGB): number {
	const sRGB = [rgb.r, rgb.g, rgb.b].map((c) => {
		const s = c / 255;
		return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

/**
 * Determines if text should be light or dark on a given background
 */
export function getContrastColor(hex: string): 'light' | 'dark' {
	const rgb = hexToRgb(hex);
	const luminance = getLuminance(rgb);
	return luminance > 0.179 ? 'dark' : 'light';
}

/**
 * Formats a color as a CSS string
 */
export function formatColor(
	hex: string,
	format: 'hex' | 'rgb' | 'hsl' = 'hex'
): string {
	const normalized = normalizeHex(hex);

	switch (format) {
		case 'rgb': {
			const { r, g, b } = hexToRgb(normalized);
			return `rgb(${r}, ${g}, ${b})`;
		}
		case 'hsl': {
			const { h, s, l } = hexToHsl(normalized);
			return `hsl(${h}, ${s}%, ${l}%)`;
		}
		default:
			return normalized;
	}
}
