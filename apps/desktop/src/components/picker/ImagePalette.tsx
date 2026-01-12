// ImagePalette component - load images and extract colors

import { ImageIcon, Upload } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

interface ImagePaletteProps {
	onColorSelect: (hex: string) => void;
}

interface ExtractedColor {
	hex: string;
	count: number;
}

export function ImagePalette({ onColorSelect }: ImagePaletteProps) {
	const [image, setImage] = useState<string | null>(null);
	const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const extractColorsFromImage = useCallback((imageUrl: string) => {
		const img = new Image();
		img.crossOrigin = 'anonymous';

		img.onload = () => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			// Resize for performance
			const maxSize = 100;
			const scale = Math.min(maxSize / img.width, maxSize / img.height);
			canvas.width = img.width * scale;
			canvas.height = img.height * scale;

			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			const pixels = imageData.data;

			// Color quantization - group similar colors
			const colorMap = new Map<string, number>();

			for (let i = 0; i < pixels.length; i += 4) {
				const r = Math.round(pixels[i] / 32) * 32;
				const g = Math.round(pixels[i + 1] / 32) * 32;
				const b = Math.round(pixels[i + 2] / 32) * 32;

				const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();

				colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
			}

			// Sort by frequency and take top colors
			const sorted = Array.from(colorMap.entries())
				.sort((a, b) => b[1] - a[1])
				.slice(0, 12)
				.map(([hex, count]) => ({ hex, count }));

			setExtractedColors(sorted);
			setIsLoading(false);
		};

		img.onerror = () => {
			setIsLoading(false);
			console.error('Failed to load image');
		};

		img.src = imageUrl;
	}, []);

	const handleFileSelect = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;

			setIsLoading(true);
			const reader = new FileReader();

			reader.onload = (event) => {
				const imageUrl = event.target?.result as string;
				setImage(imageUrl);
				extractColorsFromImage(imageUrl);
			};

			reader.readAsDataURL(file);
		},
		[extractColorsFromImage]
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			const file = e.dataTransfer.files?.[0];
			if (!file || !file.type.startsWith('image/')) return;

			setIsLoading(true);
			const reader = new FileReader();

			reader.onload = (event) => {
				const imageUrl = event.target?.result as string;
				setImage(imageUrl);
				extractColorsFromImage(imageUrl);
			};

			reader.readAsDataURL(file);
		},
		[extractColorsFromImage]
	);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
		const img = e.currentTarget;
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		canvas.width = img.naturalWidth;
		canvas.height = img.naturalHeight;
		ctx.drawImage(img, 0, 0);

		const rect = img.getBoundingClientRect();
		const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
		const y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height);

		const pixel = ctx.getImageData(x, y, 1, 1).data;
		const hex = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`.toUpperCase();

		onColorSelect(hex);
	};

	const openFilePicker = () => fileInputRef.current?.click();

	// Render upload zone when no image
	if (!image) {
		return (
			<div className="image-palette">
				<canvas ref={canvasRef} style={{ display: 'none' }} />
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={handleFileSelect}
					style={{ display: 'none' }}
				/>
				<button
					type="button"
					className="image-palette__dropzone"
					onClick={openFilePicker}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
				>
					{isLoading ? (
						<span style={{ color: 'var(--text-muted)' }}>Loading...</span>
					) : (
						<div style={{ textAlign: 'center' }}>
							<Upload size={32} style={{ color: 'var(--text-muted)', marginBottom: 8 }} />
							<p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
								Drop image or click to upload
							</p>
						</div>
					)}
				</button>
			</div>
		);
	}

	// Render image with extracted colors
	return (
		<div className="image-palette">
			<canvas ref={canvasRef} style={{ display: 'none' }} />
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleFileSelect}
				style={{ display: 'none' }}
			/>
			<div className="image-palette__content">
				<div className="image-palette__image-container">
					<img
						src={image}
						alt="Uploaded"
						className="image-palette__preview"
						onClick={handleImageClick}
						onKeyDown={() => {}}
					/>
					<button
						type="button"
						className="image-palette__change"
						onClick={openFilePicker}
						title="Change image"
					>
						<ImageIcon size={14} />
					</button>
				</div>

				{extractedColors.length > 0 && (
					<div className="image-palette__colors">
						{extractedColors.map((color) => (
							<button
								key={color.hex}
								type="button"
								className="swatch"
								style={{ backgroundColor: color.hex }}
								onClick={() => onColorSelect(color.hex)}
								title={color.hex}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
