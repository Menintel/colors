// Placeholder database types - will be generated from Supabase schema
// Run `pnpm generate-types` in packages/supabase after setting up Supabase project

export interface Database {
	public: {
		Tables: {
			workspaces: {
				Row: {
					id: string;
					user_id: string;
					name: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					name?: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					name?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			folders: {
				Row: {
					id: string;
					workspace_id: string;
					parent_id: string | null;
					name: string;
					icon: string | null;
					position: number;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					workspace_id: string;
					parent_id?: string | null;
					name: string;
					icon?: string | null;
					position?: number;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					workspace_id?: string;
					parent_id?: string | null;
					name?: string;
					icon?: string | null;
					position?: number;
					created_at?: string;
					updated_at?: string;
				};
			};
			projects: {
				Row: {
					id: string;
					workspace_id: string;
					folder_id: string | null;
					name: string;
					description: string | null;
					position: number;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					workspace_id: string;
					folder_id?: string | null;
					name: string;
					description?: string | null;
					position?: number;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					workspace_id?: string;
					folder_id?: string | null;
					name?: string;
					description?: string | null;
					position?: number;
					created_at?: string;
					updated_at?: string;
				};
			};
			colors: {
				Row: {
					id: string;
					project_id: string;
					hex: string;
					rgb: { r: number; g: number; b: number } | null;
					hsl: { h: number; s: number; l: number } | null;
					name: string | null;
					notes: string | null;
					position: number;
					source: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					project_id: string;
					hex: string;
					rgb?: { r: number; g: number; b: number } | null;
					hsl?: { h: number; s: number; l: number } | null;
					name?: string | null;
					notes?: string | null;
					position?: number;
					source: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					project_id?: string;
					hex?: string;
					rgb?: { r: number; g: number; b: number } | null;
					hsl?: { h: number; s: number; l: number } | null;
					name?: string | null;
					notes?: string | null;
					position?: number;
					source?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			reference_images: {
				Row: {
					id: string;
					project_id: string;
					storage_path: string;
					filename: string;
					extracted_colors: string[];
					created_at: string;
				};
				Insert: {
					id?: string;
					project_id: string;
					storage_path: string;
					filename: string;
					extracted_colors?: string[];
					created_at?: string;
				};
				Update: {
					id?: string;
					project_id?: string;
					storage_path?: string;
					filename?: string;
					extracted_colors?: string[];
					created_at?: string;
				};
			};
		};
		Views: Record<string, never>;
		Functions: Record<string, never>;
		Enums: Record<string, never>;
	};
}
