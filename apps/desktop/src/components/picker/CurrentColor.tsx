// CurrentColor component - selected color preview with controls

import { Copy, Pipette, Plus } from 'lucide-react';
import { useState } from 'react';

interface CurrentColorProps {
	hex: string;
	onEyeDropper?: () => void;
	onAddToProject?: () => void;
}

export function CurrentColor({ hex, onEyeDropper, onAddToProject }: CurrentColorProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(hex);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			handleCopy();
		}
	};

	return (
		<div className="current-color">
			<div
				className="current-color__preview"
				style={{ backgroundColor: hex }}
				onClick={handleCopy}
				onKeyDown={handleKeyDown}
				role="button"
				tabIndex={0}
				title={copied ? 'Copied!' : 'Click to copy'}
			/>

			{onEyeDropper && (
				<button
					type="button"
					className="current-color__eyedropper"
					onClick={onEyeDropper}
					title="Pick from screen"
				>
					<Pipette size={14} />
				</button>
			)}

			{onAddToProject && (
				<button
					type="button"
					className="current-color__eyedropper"
					onClick={onAddToProject}
					title="Add to project"
				>
					<Plus size={14} />
				</button>
			)}

			<button
				type="button"
				className="current-color__eyedropper"
				onClick={handleCopy}
				title={copied ? 'Copied!' : 'Copy hex'}
			>
				<Copy size={14} />
			</button>
		</div>
	);
}
