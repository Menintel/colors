// Main Picker Window - compact floating color picker

import { useState, useCallback, useMemo } from 'react';
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
}

export function PickerWindow({
	colors,
	projects,
	folders,
	selectedProjectId,
	onAddColor,
	onSelectProject,
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
				return <ImagePalette onColorSelect={handleImageColorSelect} />;
			case 'projects':
				return (
					<ProjectsView
						projects={projects}
						folders={folders}
						selectedProjectId={selectedProjectId}
						onSelectProject={onSelectProject}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div className="picker-window">
			{/* Title Bar - native controls handled by OS */}
			<div className="title-bar">
				<span className="title-bar__title">Colors</span>
			</div>

			{/* Tab Bar */}
			<TabBar activeTab={activeTab} onTabChange={setActiveTab} />

			{/* Picker Content */}
			<div className="picker-area">{renderPicker()}</div>

			{/* Current Color & Opacity */}
			<CurrentColor
				hex={currentHex}
				onAddToProject={handleAddToProject}
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
