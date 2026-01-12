// TabBar component - icon tabs for picker modes

import { Palette, SlidersHorizontal, ImageIcon, FolderOpen } from 'lucide-react';

export type PickerTab = 'wheel' | 'sliders' | 'image' | 'projects';

interface TabBarProps {
	activeTab: PickerTab;
	onTabChange: (tab: PickerTab) => void;
}

const tabs: { id: PickerTab; icon: typeof Palette; title: string }[] = [
	{ id: 'wheel', icon: Palette, title: 'Color Wheel' },
	{ id: 'sliders', icon: SlidersHorizontal, title: 'RGB Sliders' },
	{ id: 'image', icon: ImageIcon, title: 'Image Palette' },
	{ id: 'projects', icon: FolderOpen, title: 'Projects' },
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
	return (
		<div className="tab-bar">
			{tabs.map(({ id, icon: Icon, title }) => (
				<button
					key={id}
					type="button"
					className={`tab-bar__tab ${activeTab === id ? 'tab-bar__tab--active' : ''}`}
					onClick={() => onTabChange(id)}
					title={title}
				>
					<Icon size={18} className="tab-bar__icon" />
				</button>
			))}
		</div>
	);
}
