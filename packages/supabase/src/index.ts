// Supabase package exports

export {
	initializeSupabase,
	getSupabase,
	isSupabaseInitialized,
	type SupabaseConfig,
	type SupabaseClient,
	type Database,
} from './client';

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
} from './auth';

// Database operations
export * from './database.workspaces';
export * from './database.folders';
export * from './database.projects';
export * from './database.colors';
