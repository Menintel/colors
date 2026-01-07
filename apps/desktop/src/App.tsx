// Main App component

import { initializeSupabase } from '@colors/supabase';
import { useEffect } from 'react';
import { AuthScreen, ColorGrid, Sidebar } from './components';
import { useAuthStore, useUIStore, useWorkspaceStore } from './stores';
import './styles/index.css';

// Initialize Supabase
initializeSupabase({
	url: import.meta.env.VITE_SUPABASE_URL,
	anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
});

function App() {
	const { isAuthenticated, isLoading: authLoading, initialize } = useAuthStore();
	const { loadWorkspace, isLoading: workspaceLoading } = useWorkspaceStore();
	const { theme, setTheme } = useUIStore();

	// Initialize auth on mount
	useEffect(() => {
		initialize();
	}, [initialize]);

	// Apply theme
	useEffect(() => {
		setTheme(theme);
	}, [theme, setTheme]);

	// Load workspace when authenticated
	useEffect(() => {
		if (isAuthenticated) {
			loadWorkspace();
		}
	}, [isAuthenticated, loadWorkspace]);

	// Loading state
	if (authLoading) {
		return (
			<div className="loading-screen">
				<div className="loading-spinner" />
				<p>Loading...</p>
			</div>
		);
	}

	// Not authenticated - show auth screen
	if (!isAuthenticated) {
		return <AuthScreen />;
	}

	// Authenticated - show main app
	return (
		<div className="app-container">
			<Sidebar />
			<main className="main-content">
				{workspaceLoading ? (
					<div className="loading-screen">
						<div className="loading-spinner" />
						<p>Loading workspace...</p>
					</div>
				) : (
					<ColorGrid />
				)}
			</main>
		</div>
	);
}

export default App;
