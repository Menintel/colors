// OpacitySlider component

interface OpacitySliderProps {
	value: number; // 0-100
	onChange: (value: number) => void;
	color: string; // hex color for gradient
}

export function OpacitySlider({ value, onChange, color }: OpacitySliderProps) {
	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const newValue = Math.round((x / rect.width) * 100);
		onChange(Math.max(0, Math.min(100, newValue)));
	};

	return (
		<div className="opacity-slider">
			<span className="opacity-slider__label">Opacity</span>
			<div
				className="opacity-slider__track"
				onClick={handleClick}
				onKeyDown={() => {}}
				role="slider"
				tabIndex={0}
				aria-valuenow={value}
				aria-valuemin={0}
				aria-valuemax={100}
				style={{
					background: `linear-gradient(to right, transparent, ${color})`,
				}}
			>
				<div
					className="slider-row__thumb"
					style={{ left: `${value}%` }}
				/>
			</div>
			<span className="opacity-slider__value">{value}%</span>
		</div>
	);
}
