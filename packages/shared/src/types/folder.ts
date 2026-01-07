// Folder type definitions

export interface Folder {
	id: string;
	workspaceId: string;
	parentId?: string;
	name: string;
	icon?: string;
	position: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateFolderInput {
	workspaceId: string;
	parentId?: string;
	name: string;
	icon?: string;
}

export interface UpdateFolderInput {
	parentId?: string | null;
	name?: string;
	icon?: string;
	position?: number;
}
