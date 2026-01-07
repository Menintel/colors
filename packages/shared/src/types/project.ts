// Project type definitions

export interface Project {
	id: string;
	workspaceId: string;
	folderId?: string;
	name: string;
	description?: string;
	position: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateProjectInput {
	workspaceId: string;
	folderId?: string;
	name: string;
	description?: string;
}

export interface UpdateProjectInput {
	folderId?: string | null;
	name?: string;
	description?: string;
	position?: number;
}
