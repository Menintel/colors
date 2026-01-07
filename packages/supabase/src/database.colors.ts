// Database operations for colors

import type { Color, CreateColorInput, HSL, RGB, UpdateColorInput } from '@colors/shared';
import { hexToHsl, hexToRgb, normalizeHex } from '@colors/shared';
import { getSupabase } from './client.js';
import type { Database } from './database.types.js';

type ColorRow = Database['public']['Tables']['colors']['Row'];
type ColorInsert = Database['public']['Tables']['colors']['Insert'];
type ColorUpdate = Database['public']['Tables']['colors']['Update'];

/**
 * Get all colors for a project
 */
export async function getColors(projectId: string): Promise<Color[]> {
	const supabase = getSupabase();
	const { data, error } = await supabase.from('colors').select('*').eq('project_id', projectId).order('position', { ascending: true });

	if (error) throw error;

	return (data || []).map((row) => mapDbColorToColor(row as ColorRow));
}

/**
 * Get a single color by ID
 */
export async function getColor(id: string): Promise<Color | null> {
	const supabase = getSupabase();
	const { data, error } = await supabase.from('colors').select('*').eq('id', id).single();

	if (error) {
		if (error.code === 'PGRST116') return null; // Not found
		throw error;
	}

	return mapDbColorToColor(data as ColorRow);
}

/**
 * Create a new color
 */
export async function createColor(input: CreateColorInput): Promise<Color> {
	const supabase = getSupabase();
	const hex = normalizeHex(input.hex);
	const rgb = hexToRgb(hex);
	const hsl = hexToHsl(hex);

	// Get the max position for ordering
	const { data: maxPosData } = await supabase
		.from('colors')
		.select('position')
		.eq('project_id', input.projectId)
		.order('position', { ascending: false })
		.limit(1)
		.single();

	const position = ((maxPosData as { position: number } | null)?.position ?? -1) + 1;

	const insertData: ColorInsert = {
		project_id: input.projectId,
		hex,
		rgb,
		hsl,
		name: input.name || null,
		notes: input.notes || null,
		source: input.source,
		position,
	};

	const { data, error } = await supabase.from('colors').insert(insertData).select().single();

	if (error) throw error;
	return mapDbColorToColor(data as ColorRow);
}

/**
 * Update an existing color
 */
export async function updateColor(id: string, input: UpdateColorInput): Promise<Color> {
	const supabase = getSupabase();

	const updates: ColorUpdate = {};

	if (input.hex !== undefined) {
		const hex = normalizeHex(input.hex);
		updates.hex = hex;
		updates.rgb = hexToRgb(hex);
		updates.hsl = hexToHsl(hex);
	}

	if (input.name !== undefined) updates.name = input.name;
	if (input.notes !== undefined) updates.notes = input.notes;
	if (input.position !== undefined) updates.position = input.position;

	const { data, error } = await supabase.from('colors').update(updates).eq('id', id).select().single();

	if (error) throw error;
	return mapDbColorToColor(data as ColorRow);
}

/**
 * Delete a color
 */
export async function deleteColor(id: string): Promise<void> {
	const supabase = getSupabase();
	const { error } = await supabase.from('colors').delete().eq('id', id);

	if (error) throw error;
}

/**
 * Reorder colors within a project
 */
export async function reorderColors(_projectId: string, colorIds: string[]): Promise<void> {
	const supabase = getSupabase();

	// Update positions for each color
	const updates = colorIds.map((id, index) =>
		supabase
			.from('colors')
			.update({ position: index } as ColorUpdate)
			.eq('id', id)
	);

	await Promise.all(updates);
}

// Helper to map database row to Color type
function mapDbColorToColor(row: ColorRow): Color {
	return {
		id: row.id,
		projectId: row.project_id,
		hex: row.hex,
		rgb: (row.rgb as RGB | null) || hexToRgb(row.hex),
		hsl: (row.hsl as HSL | null) || hexToHsl(row.hex),
		name: row.name || undefined,
		notes: row.notes || undefined,
		position: row.position,
		source: row.source as 'picker' | 'image' | 'manual',
		createdAt: new Date(row.created_at),
		updatedAt: new Date(row.updated_at),
	};
}
