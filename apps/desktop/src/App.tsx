// Main App - Compact Color Picker

import { useEffect, useState } from 'react';
import { initializeSupabase } from '@colors/supabase';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useAuthStore, useWorkspaceStore } from './stores';
import { AuthScreen } from './components';
import { PickerWindow } from './components/PickerWindow';
import { useGlobalShortcut } from './hooks/useGlobalShortcut';
import './styles/index.css';

// Initialize Supabase
initializeSupabase({
	url: import.meta.env.VITE_SUPABASE_URL,
	anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
});

function App() {
	const { isAuthenticated, isLoading: authLoading, initialize, signOut } = useAuthStore();
	const {
		loadWorkspace,
		colors,
		projects,
		folders,
		createColor,
		createProject,
		selectedProjectId,
		selectProject,
	} = useWorkspaceStore();
	const [isPinned, setIsPinned] = useState(true);

	// Register global shortcut for Ctrl+Shift+C
	useGlobalShortcut();

	// Initialize auth
	useEffect(() => {
		initialize();
	}, [initialize]);

	// Load workspace when authenticated
	useEffect(() => {
		if (isAuthenticated) {
			loadWorkspace();
		}
	}, [isAuthenticated, loadWorkspace]);

	// Auto-select first project if none selected
	useEffect(() => {
		if (projects.length > 0 && !selectedProjectId) {
			selectProject(projects[0].id);
		}
	}, [projects, selectedProjectId, selectProject]);

	// Handle adding color to current project
	const handleAddColor = async (hex: string) => {
		if (selectedProjectId) {
			await createColor(hex, 'picker');
		}
	};

	const handleCreateProject = async (name: string) => {
		await loadWorkspace(); // Ensure workspace is loaded
		const project = await createProject(name);
		if (project) {
			selectProject(project.id);
		}
	};

	const handleSavePalette = async (colors: string[]) => {
		if (!selectedProjectId) return;
		// Create all colors in parallel
		await Promise.all(colors.map((hex) => createColor(hex, 'image')));
	};

	const togglePin = async () => {
		const newState = !isPinned;
		setIsPinned(newState);
		await getCurrentWindow().setAlwaysOnTop(newState);
	};




	// Loading
	if (authLoading) {
		return (
			<div className="flex-center" style={{ height: '100vh' }}>
				<span style={{ color: 'var(--text-muted)' }}>Loading...</span>
			</div>
		);
	}

	// Auth screen
	if (!isAuthenticated) {
		return <AuthScreen />;
	}

	// Main picker
	return (
		<PickerWindow
			colors={colors}
			projects={projects}
			folders={folders}
			selectedProjectId={selectedProjectId}
			onAddColor={handleAddColor}
			onSelectProject={selectProject}
			onCreateProject={handleCreateProject}
			onSavePalette={handleSavePalette}
			onLogout={signOut}
			isPinned={isPinned}
			onTogglePin={togglePin}
		/>
	);
}

export default App;
