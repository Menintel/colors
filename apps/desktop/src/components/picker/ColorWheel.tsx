// ColorWheel component - interactive HSL color wheel

import { useRef, useEffect, useCallback, useState } from 'react';

interface ColorWheelProps {
	hue: number;
	saturation: number;
	lightness: number;
	onChange: (h: number, s: number, l: number) => void;
}

export function ColorWheel({ hue, saturation, lightness, onChange }: ColorWheelProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	const size = 160;
	const radius = size / 2;

	// Draw the color wheel
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Clear canvas
		ctx.clearRect(0, 0, size, size);

		// Draw hue wheel
		for (let angle = 0; angle < 360; angle++) {
			const startAngle = ((angle - 1) * Math.PI) / 180;
			const endAngle = ((angle + 1) * Math.PI) / 180;

			ctx.beginPath();
			ctx.moveTo(radius, radius);
			ctx.arc(radius, radius, radius, startAngle, endAngle);
			ctx.closePath();

			const gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
			gradient.addColorStop(0, `hsl(${angle}, 0%, ${lightness}%)`);
			gradient.addColorStop(1, `hsl(${angle}, 100%, ${lightness}%)`);

			ctx.fillStyle = gradient;
			ctx.fill();
		}

		// Draw center circle overlay for lightness preview
		ctx.beginPath();
		ctx.arc(radius, radius, 20, 0, Math.PI * 2);
		ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
		ctx.fill();
		ctx.strokeStyle = 'rgba(255,255,255,0.3)';
		ctx.lineWidth = 1;
		ctx.stroke();
	}, [hue, saturation, lightness, radius]);

	// Calculate indicator position from HSL
	const getIndicatorPosition = useCallback(() => {
		const angle = (hue - 90) * (Math.PI / 180);
		const dist = (saturation / 100) * (radius - 10);
		return {
			x: radius + Math.cos(angle) * dist,
			y: radius + Math.sin(angle) * dist,
		};
	}, [hue, saturation, radius]);

	// Handle mouse/touch interaction
	const handleInteraction = useCallback(
		(clientX: number, clientY: number) => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			const rect = canvas.getBoundingClientRect();
			const x = clientX - rect.left - radius;
			const y = clientY - rect.top - radius;

			// Calculate hue from angle
			let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
			if (angle < 0) angle += 360;

			// Calculate saturation from distance
			const dist = Math.min(Math.sqrt(x * x + y * y), radius);
			const sat = (dist / radius) * 100;

			onChange(Math.round(angle), Math.round(sat), lightness);
		},
		[onChange, lightness, radius]
	);

	const handleMouseDown = (e: React.MouseEvent) => {
		setIsDragging(true);
		handleInteraction(e.clientX, e.clientY);
	};

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isDragging) return;
			handleInteraction(e.clientX, e.clientY);
		},
		[isDragging, handleInteraction]
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	useEffect(() => {
		if (isDragging) {
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseup', handleMouseUp);
		}
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isDragging, handleMouseMove, handleMouseUp]);

	const indicatorPos = getIndicatorPosition();

	return (
		<div className="color-wheel" ref={containerRef}>
			<div style={{ position: 'relative', width: size, height: size }}>
				<canvas
					ref={canvasRef}
					width={size}
					height={size}
					className="color-wheel__canvas"
					onMouseDown={handleMouseDown}
				/>
				<div
					className="color-wheel__indicator"
					style={{
						left: indicatorPos.x,
						top: indicatorPos.y,
						backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
					}}
				/>
			</div>
		</div>
	);
}
