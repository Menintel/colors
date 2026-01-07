// Validation utilities

import { isValidHex } from './colorConversion.js';

/**
 * Validates a project or folder name
 */
export function isValidName(name: string): boolean {
	if (!name || typeof name !== 'string') return false;
	const trimmed = name.trim();
	return trimmed.length >= 1 && trimmed.length <= 100;
}

/**
 * Validates a color name
 */
export function isValidColorName(name: string | undefined): boolean {
	if (name === undefined) return true;
	if (typeof name !== 'string') return false;
	return name.length <= 50;
}

/**
 * Validates color input for creation
 */
export function validateColorInput(input: {
	hex: string;
	name?: string;
	notes?: string;
}): { valid: boolean; errors: string[] } {
	const errors: string[] = [];

	if (!input.hex) {
		errors.push('HEX color is required');
	} else if (!isValidHex(input.hex)) {
		errors.push('Invalid HEX color format');
	}

	if (input.name !== undefined && input.name.length > 50) {
		errors.push('Color name must be 50 characters or less');
	}

	if (input.notes !== undefined && input.notes.length > 500) {
		errors.push('Notes must be 500 characters or less');
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

/**
 * Validates project input for creation
 */
export function validateProjectInput(input: {
	name: string;
	description?: string;
}): { valid: boolean; errors: string[] } {
	const errors: string[] = [];

	if (!isValidName(input.name)) {
		errors.push('Project name is required and must be 1-100 characters');
	}

	if (input.description !== undefined && input.description.length > 500) {
		errors.push('Description must be 500 characters or less');
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

/**
 * Validates folder input for creation
 */
export function validateFolderInput(input: {
	name: string;
}): { valid: boolean; errors: string[] } {
	const errors: string[] = [];

	if (!isValidName(input.name)) {
		errors.push('Folder name is required and must be 1-100 characters');
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}
