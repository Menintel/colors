// Global shortcut hook for Ctrl+Shift+C to toggle window visibility

import { register, unregister } from '@tauri-apps/plugin-global-shortcut';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useEffect } from 'react';

const TOGGLE_SHORTCUT = 'CommandOrControl+Shift+C';

export function useGlobalShortcut() {
	useEffect(() => {
		let isRegistered = false;

		const setupShortcut = async () => {
			try {
				await register(TOGGLE_SHORTCUT, async () => {
					const win = getCurrentWindow();
					const isVisible = await win.isVisible();

					if (isVisible) {
						await win.hide();
					} else {
						await win.show();
						await win.setFocus();
					}
				});
				isRegistered = true;
				console.log('Global shortcut registered:', TOGGLE_SHORTCUT);
			} catch (err) {
				console.error('Failed to register global shortcut:', err);
			}
		};

		setupShortcut();

		return () => {
			if (isRegistered) {
				unregister(TOGGLE_SHORTCUT).catch(console.error);
			}
		};
	}, []);
}
