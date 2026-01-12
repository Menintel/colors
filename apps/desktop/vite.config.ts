import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			// Workspace package aliases for dev mode
			'@colors/shared': path.resolve(__dirname, '../../packages/shared/src'),
			'@colors/supabase': path.resolve(__dirname, '../../packages/supabase/src'),
		},
	},
	// Vite options tailored for Tauri development
	clearScreen: false,
	server: {
		port: 3000,
		strictPort: false,
		watch: {
			// Use polling for Tauri dev
			usePolling: true,
		},
	},
	// Tauri expects a fixed port
	envPrefix: ['VITE_', 'TAURI_'],
	build: {
		// Tauri uses Chromium on Windows/Linux
		target: process.env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
		// Don't minify for debug builds
		minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
		// Produce sourcemaps for debug builds
		sourcemap: !!process.env.TAURI_DEBUG,
	},
	// Optimize dependencies
	optimizeDeps: {
		include: ['@supabase/supabase-js', 'zustand', 'lucide-react'],
	},
});
