// Database operations for workspaces

import type { Workspace } from '@colors/shared';
import { getSupabase } from './client';
import type { Database } from './database.types';

type WorkspaceRow = Database['public']['Tables']['workspaces']['Row'];
type WorkspaceUpdate = Database['public']['Tables']['workspaces']['Update'];

/**
 * Get the current user's workspace
 */
export async function getCurrentWorkspace(): Promise<Workspace | null> {
	const supabase = getSupabase();

	// Get current user
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return null;

	const { data, error } = await supabase.from('workspaces').select('*').eq('user_id', user.id).single();

	if (error) {
		if (error.code === 'PGRST116') return null;
		throw error;
	}

	return mapDbWorkspaceToWorkspace(data as WorkspaceRow);
}

/**
 * Update workspace name
 */
export async function updateWorkspace(id: string, name: string): Promise<Workspace> {
	const supabase = getSupabase();

	const updates: WorkspaceUpdate = { name };

	const { data, error } = await supabase.from('workspaces').update(updates).eq('id', id).select().single();

	if (error) throw error;
	return mapDbWorkspaceToWorkspace(data as WorkspaceRow);
}

// Helper to map database row to Workspace type
function mapDbWorkspaceToWorkspace(row: WorkspaceRow): Workspace {
	return {
		id: row.id,
		userId: row.user_id,
		name: row.name,
		createdAt: new Date(row.created_at),
		updatedAt: new Date(row.updated_at),
	};
}
