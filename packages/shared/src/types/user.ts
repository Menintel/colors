// User and Workspace type definitions

export interface User {
	id: string;
	email: string;
	displayName?: string;
	avatarUrl?: string;
	createdAt: Date;
}

export interface Workspace {
	id: string;
	userId: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ReferenceImage {
	id: string;
	projectId: string;
	storagePath: string;
	filename: string;
	extractedColors: string[];
	createdAt: Date;
}
