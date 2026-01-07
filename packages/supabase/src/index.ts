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
} from './auth.js';
