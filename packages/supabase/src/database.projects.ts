// Database operations for projects

import type { CreateProjectInput, Project, UpdateProjectInput } from '@colors/shared';
import { getSupabase } from './client.js';
import type { Database } from './database.types.js';

type ProjectRow = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

/**
 * Get all projects for a workspace
 */
export async function getProjects(workspaceId: string): Promise<Project[]> {
	const supabase = getSupabase();
	const { data, error } = await supabase.from('projects').select('*').eq('workspace_id', workspaceId).order('position', { ascending: true });

	if (error) throw error;

	return (data || []).map((row) => mapDbProjectToProject(row as ProjectRow));
}

/**
 * Get projects in a specific folder
 */
export async function getProjectsByFolder(workspaceId: string, folderId: string | null): Promise<Project[]> {
	const supabase = getSupabase();
	let query = supabase.from('projects').select('*').eq('workspace_id', workspaceId).order('position', { ascending: true });

	if (folderId) {
		query = query.eq('folder_id', folderId);
	} else {
		query = query.is('folder_id', null);
	}

	const { data, error } = await query;

	if (error) throw error;
	return (data || []).map((row) => mapDbProjectToProject(row as ProjectRow));
}

/**
 * Get a single project by ID
 */
export async function getProject(id: string): Promise<Project | null> {
	const supabase = getSupabase();
	const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();

	if (error) {
		if (error.code === 'PGRST116') return null;
		throw error;
	}

	return mapDbProjectToProject(data as ProjectRow);
}

/**
 * Create a new project
 */
export async function createProject(input: CreateProjectInput): Promise<Project> {
	const supabase = getSupabase();

	// Get the max position for ordering
	const { data: maxPosData } = await supabase
		.from('projects')
		.select('position')
		.eq('workspace_id', input.workspaceId)
		.order('position', { ascending: false })
		.limit(1)
		.single();

	const position = ((maxPosData as { position: number } | null)?.position ?? -1) + 1;

	const insertData: ProjectInsert = {
		workspace_id: input.workspaceId,
		folder_id: input.folderId || null,
		name: input.name,
		description: input.description || null,
		position,
	};

	const { data, error } = await supabase.from('projects').insert(insertData).select().single();

	if (error) throw error;
	return mapDbProjectToProject(data as ProjectRow);
}

/**
 * Update an existing project
 */
export async function updateProject(id: string, input: UpdateProjectInput): Promise<Project> {
	const supabase = getSupabase();

	const updates: ProjectUpdate = {};

	if (input.name !== undefined) updates.name = input.name;
	if (input.description !== undefined) updates.description = input.description;
	if (input.folderId !== undefined) updates.folder_id = input.folderId;
	if (input.position !== undefined) updates.position = input.position;

	const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select().single();

	if (error) throw error;
	return mapDbProjectToProject(data as ProjectRow);
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<void> {
	const supabase = getSupabase();
	const { error } = await supabase.from('projects').delete().eq('id', id);

	if (error) throw error;
}

// Helper to map database row to Project type
function mapDbProjectToProject(row: ProjectRow): Project {
	return {
		id: row.id,
		workspaceId: row.workspace_id,
		folderId: row.folder_id || undefined,
		name: row.name,
		description: row.description || undefined,
		position: row.position,
		createdAt: new Date(row.created_at),
		updatedAt: new Date(row.updated_at),
	};
}
