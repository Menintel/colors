// Auth store using Zustand

import {
	getCurrentUser,
	getSession,
	onAuthStateChange,
	signIn as supabaseSignIn,
	signOut as supabaseSignOut,
	signUp as supabaseSignUp,
	type Session,
	type User,
} from '@colors/supabase';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
	user: User | null;
	session: Session | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	error: string | null;

	// Actions
	initialize: () => Promise<void>;
	signIn: (email: string, password: string) => Promise<boolean>;
	signUp: (email: string, password: string) => Promise<boolean>;
	signOut: () => Promise<void>;
	clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, _get) => ({
			user: null,
			session: null,
			isLoading: true,
			isAuthenticated: false,
			error: null,

			initialize: async () => {
				try {
					set({ isLoading: true });
					const [user, session] = await Promise.all([getCurrentUser(), getSession()]);

					set({
						user,
						session,
						isAuthenticated: !!user,
						isLoading: false,
					});

					// Listen for auth changes
					onAuthStateChange((_event, session) => {
						set({
							user: session?.user ?? null,
							session,
							isAuthenticated: !!session?.user,
						});
					});
				} catch (error) {
					set({
						isLoading: false,
						error: error instanceof Error ? error.message : 'Failed to initialize',
					});
				}
			},

			signIn: async (email: string, password: string) => {
				try {
					set({ isLoading: true, error: null });
					const result = await supabaseSignIn(email, password);

					if (result.error) {
						set({ isLoading: false, error: result.error.message });
						return false;
					}

					set({
						user: result.user,
						session: result.session,
						isAuthenticated: !!result.user,
						isLoading: false,
					});
					return true;
				} catch (error) {
					set({
						isLoading: false,
						error: error instanceof Error ? error.message : 'Sign in failed',
					});
					return false;
				}
			},

			signUp: async (email: string, password: string) => {
				try {
					set({ isLoading: true, error: null });
					const result = await supabaseSignUp(email, password);

					if (result.error) {
						set({ isLoading: false, error: result.error.message });
						return false;
					}

					set({
						user: result.user,
						session: result.session,
						isAuthenticated: !!result.session,
						isLoading: false,
					});
					return true;
				} catch (error) {
					set({
						isLoading: false,
						error: error instanceof Error ? error.message : 'Sign up failed',
					});
					return false;
				}
			},

			signOut: async () => {
				try {
					set({ isLoading: true });
					await supabaseSignOut();
					set({
						user: null,
						session: null,
						isAuthenticated: false,
						isLoading: false,
					});
				} catch (error) {
					set({
						isLoading: false,
						error: error instanceof Error ? error.message : 'Sign out failed',
					});
				}
			},

			clearError: () => set({ error: null }),
		}),
		{
			name: 'colors-auth',
			partialize: (_state) => ({
				// Only persist minimal data, session is managed by Supabase
			}),
		}
	)
);
