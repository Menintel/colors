// SwatchBar component - horizontal scrollable color grid

import type { Color } from '@colors/shared';

interface SwatchBarProps {
	colors: Color[];
	selectedId: string | null;
	onSelect: (color: Color) => void;
	onAdd?: () => void;
}

export function SwatchBar({ colors, selectedId, onSelect }: SwatchBarProps) {
	if (colors.length === 0) {
		return (
			<div className="swatch-bar">
				<span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
					No colors saved
				</span>
			</div>
		);
	}

	return (
		<div className="swatch-bar">
			{colors.map((color) => (
				<button
					key={color.id}
					type="button"
					className={`swatch ${selectedId === color.id ? 'swatch--selected' : ''}`}
					style={{ backgroundColor: color.hex }}
					onClick={() => onSelect(color)}
					title={color.name || color.hex}
				/>
			))}
		</div>
	);
}
