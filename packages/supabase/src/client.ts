// Supabase client setup

import { type SupabaseClient, createClient } from '@supabase/supabase-js';
import type { Database } from './database.types.js';

let supabaseClient: SupabaseClient<Database> | null = null;

export interface SupabaseConfig {
	url: string;
	anonKey: string;
}

/**
 * Initialize the Supabase client
 * Call this once at app startup
 */
export function initializeSupabase(config: SupabaseConfig): SupabaseClient<Database> {
	if (supabaseClient) {
		return supabaseClient;
	}

	supabaseClient = createClient<Database>(config.url, config.anonKey, {
		auth: {
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: true,
		},
	});

	return supabaseClient;
}

/**
 * Get the initialized Supabase client
 * Throws if not initialized
 */
export function getSupabase(): SupabaseClient<Database> {
	if (!supabaseClient) {
		throw new Error('Supabase client not initialized. Call initializeSupabase() first.');
	}
	return supabaseClient;
}

/**
 * Check if Supabase client is initialized
 */
export function isSupabaseInitialized(): boolean {
	return supabaseClient !== null;
}

export type { SupabaseClient } from '@supabase/supabase-js';
export type { Database } from './database.types.js';
