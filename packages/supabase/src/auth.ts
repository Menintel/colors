// Authentication helpers

import type { AuthError, Session, User } from '@supabase/supabase-js';
import { getSupabase } from './client.js';

export interface AuthResult {
	user: User | null;
	session: Session | null;
	error: AuthError | null;
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string): Promise<AuthResult> {
	const supabase = getSupabase();
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
	});

	return {
		user: data.user,
		session: data.session,
		error,
	};
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<AuthResult> {
	const supabase = getSupabase();
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	return {
		user: data.user,
		session: data.session,
		error,
	};
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
	const supabase = getSupabase();
	const { error } = await supabase.auth.signOut();
	return { error };
}

/**
 * Get the current user
 */
export async function getCurrentUser(): Promise<User | null> {
	const supabase = getSupabase();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return user;
}

/**
 * Get the current session
 */
export async function getSession(): Promise<Session | null> {
	const supabase = getSupabase();
	const {
		data: { session },
	} = await supabase.auth.getSession();
	return session;
}

/**
 * Request password reset email
 */
export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
	const supabase = getSupabase();
	const { error } = await supabase.auth.resetPasswordForEmail(email);
	return { error };
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: Session | null) => void): { unsubscribe: () => void } {
	const supabase = getSupabase();
	const {
		data: { subscription },
	} = supabase.auth.onAuthStateChange(callback);
	return { unsubscribe: () => subscription.unsubscribe() };
}
