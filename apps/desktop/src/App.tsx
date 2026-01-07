import { Palette } from 'lucide-react';
import { useState } from 'react';

function App() {
	const [count, setCount] = useState(0);

	return (
		<div className="app">
			<header className="app-header">
				<Palette size={48} className="logo" />
				<h1>Colors</h1>
				<p>A lightweight cross-platform color palette application</p>
			</header>

			<main className="app-main">
				<div className="card">
					<button type="button" onClick={() => setCount((c) => c + 1)}>
						Count is {count}
					</button>
					<p>
						Edit <code>src/App.tsx</code> and save to test HMR
					</p>
				</div>

				<div className="features">
					<div className="feature">
						<span className="feature-icon">🎨</span>
						<h3>Screen Color Picker</h3>
						<p>Pick colors from anywhere on your screen</p>
					</div>
					<div className="feature">
						<span className="feature-icon">📁</span>
						<h3>Project Organization</h3>
						<p>Organize colors into projects and folders</p>
					</div>
					<div className="feature">
						<span className="feature-icon">☁️</span>
						<h3>Cloud Sync</h3>
						<p>Sync across devices with Supabase</p>
					</div>
				</div>
			</main>

			<footer className="app-footer">
				<p>Built with Tauri + React + TypeScript</p>
			</footer>
		</div>
	);
}

export default App;
