// UI store - manages UI state like sidebar, modals, theme

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';
type View = 'grid' | 'list';

interface UIState {
	// Sidebar
	sidebarOpen: boolean;
	sidebarWidth: number;

	// Theme
	theme: Theme;
	resolvedTheme: 'light' | 'dark';

	// View preferences
	colorView: View;

	// Modals
	showNewProjectModal: boolean;
	showNewFolderModal: boolean;
	showColorDetailModal: boolean;
	selectedColorId: string | null;

	// Actions
	toggleSidebar: () => void;
	setSidebarWidth: (width: number) => void;
	setTheme: (theme: Theme) => void;
	setColorView: (view: View) => void;

	// Modal actions
	openNewProjectModal: () => void;
	closeNewProjectModal: () => void;
	openNewFolderModal: () => void;
	closeNewFolderModal: () => void;
	openColorDetail: (colorId: string) => void;
	closeColorDetail: () => void;
}

const getSystemTheme = (): 'light' | 'dark' => {
	if (typeof window !== 'undefined') {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}
	return 'dark';
};

export const useUIStore = create<UIState>()(
	persist(
		(set, _get) => ({
			sidebarOpen: true,
			sidebarWidth: 260,
			theme: 'system',
			resolvedTheme: getSystemTheme(),
			colorView: 'grid',
			showNewProjectModal: false,
			showNewFolderModal: false,
			showColorDetailModal: false,
			selectedColorId: null,

			toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

			setSidebarWidth: (width: number) => set({ sidebarWidth: width }),

			setTheme: (theme: Theme) => {
				const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
				set({ theme, resolvedTheme });

				// Apply to document
				if (typeof document !== 'undefined') {
					document.documentElement.classList.remove('light', 'dark');
					document.documentElement.classList.add(resolvedTheme);
				}
			},

			setColorView: (view: View) => set({ colorView: view }),

			openNewProjectModal: () => set({ showNewProjectModal: true }),
			closeNewProjectModal: () => set({ showNewProjectModal: false }),

			openNewFolderModal: () => set({ showNewFolderModal: true }),
			closeNewFolderModal: () => set({ showNewFolderModal: false }),

			openColorDetail: (colorId: string) => set({ showColorDetailModal: true, selectedColorId: colorId }),
			closeColorDetail: () => set({ showColorDetailModal: false, selectedColorId: null }),
		}),
		{
			name: 'colors-ui',
			partialize: (state) => ({
				sidebarOpen: state.sidebarOpen,
				sidebarWidth: state.sidebarWidth,
				theme: state.theme,
				colorView: state.colorView,
			}),
		}
	)
);
