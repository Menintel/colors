// Main Picker Window - compact floating color picker

import { useState, useCallback, useMemo } from 'react';
import { LogOut, Pin, PinOff } from 'lucide-react';
import { hexToRgb, hexToHsl, rgbToHex, hslToHex } from '@colors/shared';
import type { Color, Project, Folder } from '@colors/shared';
import {
	TabBar,
	type PickerTab,
	ColorWheel,
	ColorSliders,
	SwatchBar,
	CurrentColor,
	OpacitySlider,
	ImagePalette,
	ProjectsView,
} from './picker';

interface PickerWindowProps {
	colors: Color[];
	projects: Project[];
	folders: Folder[];
	selectedProjectId: string | null;
	onAddColor: (hex: string) => void;
	onSelectProject: (projectId: string) => void;
	onCreateProject?: (name: string) => void;
	onSavePalette: (colors: string[]) => void;
	onLogout: () => void;
	isPinned: boolean;
	onTogglePin: () => void;
}

export function PickerWindow({
	colors,
	projects,
	folders,
	selectedProjectId,
	onAddColor,
	onSelectProject,
	onCreateProject,
	onSavePalette,
	onLogout,
	isPinned,
	onTogglePin,
}: PickerWindowProps) {
	const [activeTab, setActiveTab] = useState<PickerTab>('wheel');
	const [currentHex, setCurrentHex] = useState('#00FA92');
	const [opacity, setOpacity] = useState(100);
	const [selectedSwatchId, setSelectedSwatchId] = useState<string | null>(null);

	// Derived color values
	const rgb = useMemo(() => hexToRgb(currentHex), [currentHex]);
	const hsl = useMemo(() => hexToHsl(currentHex), [currentHex]);

	// Color change handlers
	const handleHslChange = useCallback((h: number, s: number, l: number) => {
		const hex = hslToHex({ h, s, l });
		setCurrentHex(hex);
	}, []);

	const handleRgbChange = useCallback((r: number, g: number, b: number) => {
		const hex = rgbToHex({ r, g, b });
		setCurrentHex(hex);
	}, []);

	const handleHexChange = useCallback((hex: string) => {
		setCurrentHex(hex);
	}, []);

	const handleSwatchSelect = useCallback((color: Color) => {
		setCurrentHex(color.hex);
		setSelectedSwatchId(color.id);
	}, []);

	const handleAddToProject = useCallback(() => {
		onAddColor(currentHex);
	}, [currentHex, onAddColor]);

	const handleImageColorSelect = useCallback((hex: string) => {
		setCurrentHex(hex);
	}, []);

	const openEyeDropper = async () => {
		if (!('EyeDropper' in window)) {
			console.error('EyeDropper API not supported');
			return;
		}

		try {
			// @ts-ignore - TypeScript might not know about EyeDropper yet
			const eyeDropper = new window.EyeDropper();
			const result = await eyeDropper.open();
			const hex = result.sRGBHex;
			setCurrentHex(hex);
		} catch (e) {
			console.log('EyeDropper canceled or failed', e);
		}
	};

	// Render active picker tab content
	const renderPicker = () => {
		switch (activeTab) {
			case 'wheel':
				return (
					<ColorWheel
						hue={hsl.h}
						saturation={hsl.s}
						lightness={hsl.l}
						onChange={handleHslChange}
					/>
				);
			case 'sliders':
				return (
					<ColorSliders
						red={rgb.r}
						green={rgb.g}
						blue={rgb.b}
						onChange={handleRgbChange}
						hex={currentHex}
						onHexChange={handleHexChange}
					/>
				);
			case 'image':
				return <ImagePalette onColorSelect={handleImageColorSelect} onSavePalette={onSavePalette} />;
			case 'projects':
				return (
					<ProjectsView
						projects={projects}
						folders={folders}
						selectedProjectId={selectedProjectId}
						onSelectProject={onSelectProject}
						onCreateProject={onCreateProject}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div className="picker-window">
			{/* Title Bar */}
			<div className="title-bar">
				<span className="title-bar__title">Colors</span>
				<button
					type="button"
					className={`title-bar__pin ${isPinned ? 'title-bar__pin--active' : ''}`}
					onClick={onTogglePin}
					title={isPinned ? 'Unpin from top' : 'Pin to top'}
				>
					{isPinned ? <Pin size={14} /> : <PinOff size={14} />}
				</button>
				<button
					type="button"
					className="title-bar__logout"
					onClick={onLogout}
					title="Sign out"
				>
					<LogOut size={14} />
				</button>
			</div>

			{/* Tab Bar */}
			<TabBar activeTab={activeTab} onTabChange={setActiveTab} />

			{/* Picker Content */}
			<div className="picker-area">{renderPicker()}</div>

			{/* Current Color & Opacity */}
			<CurrentColor
				hex={currentHex}
				onAddToProject={handleAddToProject}
				onEyeDropper={openEyeDropper}
			/>
			<OpacitySlider
				value={opacity}
				onChange={setOpacity}
				color={currentHex}
			/>

			{/* Swatch Bar */}
			<SwatchBar
				colors={colors}
				selectedId={selectedSwatchId}
				onSelect={handleSwatchSelect}
			/>
		</div>
	);
}
