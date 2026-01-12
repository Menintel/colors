// Database operations for folders

import type { CreateFolderInput, Folder, UpdateFolderInput } from '@colors/shared';
import { getSupabase } from './client';
import type { Database } from './database.types';

type FolderRow = Database['public']['Tables']['folders']['Row'];
type FolderInsert = Database['public']['Tables']['folders']['Insert'];
type FolderUpdate = Database['public']['Tables']['folders']['Update'];

/**
 * Get all folders for a workspace
 */
export async function getFolders(workspaceId: string): Promise<Folder[]> {
	const supabase = getSupabase();
	const { data, error } = await supabase.from('folders').select('*').eq('workspace_id', workspaceId).order('position', { ascending: true });

	if (error) throw error;

	return (data || []).map((row) => mapDbFolderToFolder(row as FolderRow));
}

/**
 * Get root folders (no parent)
 */
export async function getRootFolders(workspaceId: string): Promise<Folder[]> {
	const supabase = getSupabase();
	const { data, error } = await supabase
		.from('folders')
		.select('*')
		.eq('workspace_id', workspaceId)
		.is('parent_id', null)
		.order('position', { ascending: true });

	if (error) throw error;
	return (data || []).map((row) => mapDbFolderToFolder(row as FolderRow));
}

/**
 * Get child folders
 */
export async function getChildFolders(workspaceId: string, parentId: string): Promise<Folder[]> {
	const supabase = getSupabase();
	const { data, error } = await supabase
		.from('folders')
		.select('*')
		.eq('workspace_id', workspaceId)
		.eq('parent_id', parentId)
		.order('position', { ascending: true });

	if (error) throw error;
	return (data || []).map((row) => mapDbFolderToFolder(row as FolderRow));
}

/**
 * Get a single folder by ID
 */
export async function getFolder(id: string): Promise<Folder | null> {
	const supabase = getSupabase();
	const { data, error } = await supabase.from('folders').select('*').eq('id', id).single();

	if (error) {
		if (error.code === 'PGRST116') return null;
		throw error;
	}

	return mapDbFolderToFolder(data as FolderRow);
}

/**
 * Create a new folder
 */
export async function createFolder(input: CreateFolderInput): Promise<Folder> {
	const supabase = getSupabase();

	// Get the max position for ordering
	const { data: maxPosData } = await supabase
		.from('folders')
		.select('position')
		.eq('workspace_id', input.workspaceId)
		.order('position', { ascending: false })
		.limit(1)
		.single();

	const position = ((maxPosData as { position: number } | null)?.position ?? -1) + 1;

	const insertData: FolderInsert = {
		workspace_id: input.workspaceId,
		parent_id: input.parentId || null,
		name: input.name,
		icon: input.icon || null,
		position,
	};

	const { data, error } = await supabase.from('folders').insert(insertData).select().single();

	if (error) throw error;
	return mapDbFolderToFolder(data as FolderRow);
}

/**
 * Update an existing folder
 */
export async function updateFolder(id: string, input: UpdateFolderInput): Promise<Folder> {
	const supabase = getSupabase();

	const updates: FolderUpdate = {};

	if (input.name !== undefined) updates.name = input.name;
	if (input.icon !== undefined) updates.icon = input.icon;
	if (input.parentId !== undefined) updates.parent_id = input.parentId;
	if (input.position !== undefined) updates.position = input.position;

	const { data, error } = await supabase.from('folders').update(updates).eq('id', id).select().single();

	if (error) throw error;
	return mapDbFolderToFolder(data as FolderRow);
}

/**
 * Delete a folder
 */
export async function deleteFolder(id: string): Promise<void> {
	const supabase = getSupabase();
	const { error } = await supabase.from('folders').delete().eq('id', id);

	if (error) throw error;
}

// Helper to map database row to Folder type
function mapDbFolderToFolder(row: FolderRow): Folder {
	return {
		id: row.id,
		workspaceId: row.workspace_id,
		parentId: row.parent_id || undefined,
		name: row.name,
		icon: row.icon || undefined,
		position: row.position,
		createdAt: new Date(row.created_at),
		updatedAt: new Date(row.updated_at),
	};
}
