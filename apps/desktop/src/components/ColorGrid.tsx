// Color grid - displays all colors in a project

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useUIStore, useWorkspaceStore } from '../stores';
import { ColorCard } from './ColorCard';
import './ColorGrid.css';

export function ColorGrid() {
	const { colors, selectedProjectId, projects, createColor } = useWorkspaceStore();
	const { colorView } = useUIStore();
	const [showInput, setShowInput] = useState(false);
	const [hexInput, setHexInput] = useState('');

	const selectedProject = projects.find((p) => p.id === selectedProjectId);

	const handleAddColor = async () => {
		if (!hexInput.trim()) return;

		let hex = hexInput.trim();
		if (!hex.startsWith('#')) {
			hex = `#${hex}`;
		}

		// Basic validation
		if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
			alert('Please enter a valid hex color (e.g., #FF5733)');
			return;
		}

		await createColor(hex, 'manual');
		setHexInput('');
		setShowInput(false);
	};

	if (!selectedProjectId) {
		return (
			<div className="color-grid-empty">
				<div className="empty-content">
					<span className="empty-icon">🎨</span>
					<h2>Select a project</h2>
					<p>Choose a project from the sidebar to view its colors</p>
				</div>
			</div>
		);
	}

	return (
		<div className="color-grid-container">
			<div className="color-grid-header">
				<div className="header-info">
					<h2>{selectedProject?.name}</h2>
					<span className="color-count">{colors.length} colors</span>
				</div>
				<button type="button" className="add-color-btn" onClick={() => setShowInput(true)}>
					<Plus size={18} />
					Add Color
				</button>
			</div>

			{showInput && (
				<div className="add-color-input">
					<input
						type="text"
						placeholder="#FF5733"
						value={hexInput}
						onChange={(e) => setHexInput(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleAddColor()}
					/>
					<button type="button" onClick={handleAddColor}>
						Add
					</button>
					<button
						type="button"
						className="cancel-btn"
						onClick={() => {
							setShowInput(false);
							setHexInput('');
						}}
					>
						Cancel
					</button>
				</div>
			)}

			{colors.length === 0 ? (
				<div className="color-grid-empty">
					<div className="empty-content">
						<span className="empty-icon">🌈</span>
						<h3>No colors yet</h3>
						<p>Add your first color to get started</p>
					</div>
				</div>
			) : (
				<div className={`color-grid ${colorView}`}>
					{colors.map((color) => (
						<ColorCard key={color.id} color={color} />
					))}
				</div>
			)}
		</div>
	);
}
