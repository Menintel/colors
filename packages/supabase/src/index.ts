// Supabase package exports

export {
	initializeSupabase,
	getSupabase,
	isSupabaseInitialized,
	type SupabaseConfig,
	type SupabaseClient,
	type Database,
} from './client.js';

export {
	signUp,
	signIn,
	signOut,
	getCurrentUser,
	getSession,
	resetPassword,
	onAuthStateChange,
	type AuthResult,
	type User,
	type Session,
	type AuthError,
} from './auth.js';

// Database operations
export * from './database.workspaces.js';
export * from './database.folders.js';
export * from './database.projects.js';
export * from './database.colors.js';
