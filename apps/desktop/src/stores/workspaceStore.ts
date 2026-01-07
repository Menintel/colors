// Workspace store - manages folders, projects, and colors

import type { Color, Folder, Project, Workspace } from '@colors/shared';
import {
	createColor as apiCreateColor,
	createFolder as apiCreateFolder,
	createProject as apiCreateProject,
	deleteColor as apiDeleteColor,
	deleteFolder as apiDeleteFolder,
	deleteProject as apiDeleteProject,
	getColors,
	getCurrentWorkspace,
	getFolders,
	getProjects,
} from '@colors/supabase';
import { create } from 'zustand';

interface WorkspaceState {
	// Data
	workspace: Workspace | null;
	folders: Folder[];
	projects: Project[];
	colors: Color[];

	// Selection
	selectedFolderId: string | null;
	selectedProjectId: string | null;

	// Loading states
	isLoading: boolean;
	error: string | null;

	// Actions
	loadWorkspace: () => Promise<void>;
	loadProjects: () => Promise<void>;
	loadColors: (projectId: string) => Promise<void>;

	selectFolder: (folderId: string | null) => void;
	selectProject: (projectId: string | null) => void;

	createProject: (name: string, folderId?: string) => Promise<Project | null>;
	createFolder: (name: string, parentId?: string) => Promise<Folder | null>;
	createColor: (hex: string, source: 'picker' | 'image' | 'manual') => Promise<Color | null>;

	deleteProject: (id: string) => Promise<void>;
	deleteFolder: (id: string) => Promise<void>;
	deleteColor: (id: string) => Promise<void>;

	clearError: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()((set, get) => ({
	workspace: null,
	folders: [],
	projects: [],
	colors: [],
	selectedFolderId: null,
	selectedProjectId: null,
	isLoading: false,
	error: null,

	loadWorkspace: async () => {
		try {
			set({ isLoading: true, error: null });
			const workspace = await getCurrentWorkspace();

			if (!workspace) {
				set({ isLoading: false, error: 'No workspace found' });
				return;
			}

			const [folders, projects] = await Promise.all([getFolders(workspace.id), getProjects(workspace.id)]);

			set({
				workspace,
				folders,
				projects,
				isLoading: false,
			});
		} catch (error) {
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : 'Failed to load workspace',
			});
		}
	},

	loadProjects: async () => {
		const { workspace } = get();
		if (!workspace) return;

		try {
			const projects = await getProjects(workspace.id);
			set({ projects });
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : 'Failed to load projects',
			});
		}
	},

	loadColors: async (projectId: string) => {
		try {
			const colors = await getColors(projectId);
			set({ colors });
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : 'Failed to load colors',
			});
		}
	},

	selectFolder: (folderId: string | null) => {
		set({ selectedFolderId: folderId, selectedProjectId: null, colors: [] });
	},

	selectProject: async (projectId: string | null) => {
		set({ selectedProjectId: projectId });
		if (projectId) {
			await get().loadColors(projectId);
		} else {
			set({ colors: [] });
		}
	},

	createProject: async (name: string, folderId?: string) => {
		const { workspace } = get();
		if (!workspace) return null;

		try {
			const project = await apiCreateProject({
				workspaceId: workspace.id,
				name,
				folderId,
			});
			set((state) => ({ projects: [...state.projects, project] }));
			return project;
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : 'Failed to create project',
			});
			return null;
		}
	},

	createFolder: async (name: string, parentId?: string) => {
		const { workspace } = get();
		if (!workspace) return null;

		try {
			const folder = await apiCreateFolder({
				workspaceId: workspace.id,
				name,
				parentId,
			});
			set((state) => ({ folders: [...state.folders, folder] }));
			return folder;
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : 'Failed to create folder',
			});
			return null;
		}
	},

	createColor: async (hex: string, source: 'picker' | 'image' | 'manual') => {
		const { selectedProjectId } = get();
		if (!selectedProjectId) return null;

		try {
			const color = await apiCreateColor({
				projectId: selectedProjectId,
				hex,
				source,
			});
			set((state) => ({ colors: [...state.colors, color] }));
			return color;
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : 'Failed to create color',
			});
			return null;
		}
	},

	deleteProject: async (id: string) => {
		try {
			await apiDeleteProject(id);
			set((state) => ({
				projects: state.projects.filter((p) => p.id !== id),
				selectedProjectId: state.selectedProjectId === id ? null : state.selectedProjectId,
				colors: state.selectedProjectId === id ? [] : state.colors,
			}));
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : 'Failed to delete project',
			});
		}
	},

	deleteFolder: async (id: string) => {
		try {
			await apiDeleteFolder(id);
			set((state) => ({
				folders: state.folders.filter((f) => f.id !== id),
				selectedFolderId: state.selectedFolderId === id ? null : state.selectedFolderId,
			}));
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : 'Failed to delete folder',
			});
		}
	},

	deleteColor: async (id: string) => {
		try {
			await apiDeleteColor(id);
			set((state) => ({
				colors: state.colors.filter((c) => c.id !== id),
			}));
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : 'Failed to delete color',
			});
		}
	},

	clearError: () => set({ error: null }),
}));
