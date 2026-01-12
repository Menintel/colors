// ColorSliders component - RGB sliders with value inputs

import { useCallback } from 'react';

interface ColorSlidersProps {
	red: number;
	green: number;
	blue: number;
	onChange: (r: number, g: number, b: number) => void;
	hex: string;
	onHexChange: (hex: string) => void;
}

export function ColorSliders({
	red,
	green,
	blue,
	onChange,
	hex,
	onHexChange,
}: ColorSlidersProps) {
	const handleSliderChange = useCallback(
		(channel: 'r' | 'g' | 'b', value: number) => {
			const clamped = Math.max(0, Math.min(255, value));
			if (channel === 'r') onChange(clamped, green, blue);
			else if (channel === 'g') onChange(red, clamped, blue);
			else onChange(red, green, clamped);
		},
		[red, green, blue, onChange]
	);

	const handleTrackClick = useCallback(
		(channel: 'r' | 'g' | 'b', e: React.MouseEvent<HTMLDivElement>) => {
			const rect = e.currentTarget.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const value = Math.round((x / rect.width) * 255);
			handleSliderChange(channel, value);
		},
		[handleSliderChange]
	);

	const handleInputChange = useCallback(
		(channel: 'r' | 'g' | 'b', e: React.ChangeEvent<HTMLInputElement>) => {
			const value = Number.parseInt(e.target.value, 10);
			if (!Number.isNaN(value)) {
				handleSliderChange(channel, value);
			}
		},
		[handleSliderChange]
	);

	const handleHexSubmit = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			let value = e.target.value.trim();
			if (!value.startsWith('#')) value = `#${value}`;
			if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
				onHexChange(value);
			}
		},
		[onHexChange]
	);

	// Calculate gradient backgrounds for current color context
	const redGradient = `linear-gradient(to right, rgb(0, ${green}, ${blue}), rgb(255, ${green}, ${blue}))`;
	const greenGradient = `linear-gradient(to right, rgb(${red}, 0, ${blue}), rgb(${red}, 255, ${blue}))`;
	const blueGradient = `linear-gradient(to right, rgb(${red}, ${green}, 0), rgb(${red}, ${green}, 255))`;

	return (
		<div className="color-sliders">
			{/* Red slider */}
			<div className="slider-row">
				<span className="slider-row__label">Red</span>
				<div
					className="slider-row__track"
					style={{ background: redGradient }}
					onClick={(e) => handleTrackClick('r', e)}
					onKeyDown={() => {}}
					role="slider"
					tabIndex={0}
					aria-valuenow={red}
					aria-valuemin={0}
					aria-valuemax={255}
				>
					<div
						className="slider-row__thumb"
						style={{ left: `${(red / 255) * 100}%` }}
					/>
				</div>
				<input
					type="number"
					className="slider-row__value"
					value={red}
					min={0}
					max={255}
					onChange={(e) => handleInputChange('r', e)}
				/>
			</div>

			{/* Green slider */}
			<div className="slider-row">
				<span className="slider-row__label">Green</span>
				<div
					className="slider-row__track"
					style={{ background: greenGradient }}
					onClick={(e) => handleTrackClick('g', e)}
					onKeyDown={() => {}}
					role="slider"
					tabIndex={0}
					aria-valuenow={green}
					aria-valuemin={0}
					aria-valuemax={255}
				>
					<div
						className="slider-row__thumb"
						style={{ left: `${(green / 255) * 100}%` }}
					/>
				</div>
				<input
					type="number"
					className="slider-row__value"
					value={green}
					min={0}
					max={255}
					onChange={(e) => handleInputChange('g', e)}
				/>
			</div>

			{/* Blue slider */}
			<div className="slider-row">
				<span className="slider-row__label">Blue</span>
				<div
					className="slider-row__track"
					style={{ background: blueGradient }}
					onClick={(e) => handleTrackClick('b', e)}
					onKeyDown={() => {}}
					role="slider"
					tabIndex={0}
					aria-valuenow={blue}
					aria-valuemin={0}
					aria-valuemax={255}
				>
					<div
						className="slider-row__thumb"
						style={{ left: `${(blue / 255) * 100}%` }}
					/>
				</div>
				<input
					type="number"
					className="slider-row__value"
					value={blue}
					min={0}
					max={255}
					onChange={(e) => handleInputChange('b', e)}
				/>
			</div>

			{/* Hex input */}
			<div className="hex-input">
				<span className="hex-input__label">Hex Color #</span>
				<input
					type="text"
					className="hex-input__field"
					value={hex.replace('#', '')}
					maxLength={6}
					onChange={handleHexSubmit}
				/>
			</div>
		</div>
	);
}
