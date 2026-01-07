// Color card component - displays a single color

import type { Color } from '@colors/shared';
import { getContrastColor } from '@colors/shared';
import { Check, Copy, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useUIStore, useWorkspaceStore } from '../stores';
import './ColorCard.css';

interface ColorCardProps {
	color: Color;
}

export function ColorCard({ color }: ColorCardProps) {
	const [copied, setCopied] = useState(false);
	const { deleteColor } = useWorkspaceStore();
	const { openColorDetail } = useUIStore();

	const textColor = getContrastColor(color.hex);

	const copyToClipboard = async (e: React.MouseEvent) => {
		e.stopPropagation();
		try {
			await navigator.clipboard.writeText(color.hex);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	};

	const handleDelete = async (e: React.MouseEvent) => {
		e.stopPropagation();
		if (confirm('Delete this color?')) {
			await deleteColor(color.id);
		}
	};

	return (
		<button
			type="button"
			className="color-card"
			style={{ backgroundColor: color.hex }}
			onClick={() => openColorDetail(color.id)}
		>
			<div className="color-actions" style={{ color: textColor }}>
				<button type="button" className="color-action-btn" onClick={copyToClipboard} title="Copy hex" style={{ color: textColor }}>
					{copied ? <Check size={16} /> : <Copy size={16} />}
				</button>
				<button type="button" className="color-action-btn delete" onClick={handleDelete} title="Delete" style={{ color: textColor }}>
					<Trash2 size={16} />
				</button>
			</div>

			<div className="color-info" style={{ color: textColor }}>
				{color.name && <span className="color-name">{color.name}</span>}
				<span className="color-hex">{color.hex.toUpperCase()}</span>
			</div>
		</button>
	);
}
