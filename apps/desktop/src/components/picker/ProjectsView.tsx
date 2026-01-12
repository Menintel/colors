// ProjectsView component - list saved projects and load their colors

import { useState } from 'react';
import { FolderPlus, ChevronRight, Palette } from 'lucide-react';
import type { Project, Folder } from '@colors/shared';

interface ProjectsViewProps {
	projects: Project[];
	folders: Folder[];
	selectedProjectId: string | null;
	onSelectProject: (projectId: string) => void;
	onCreateProject?: (name: string) => void;
}

export function ProjectsView({
	projects,
	folders,
	selectedProjectId,
	onSelectProject,
	onCreateProject,
}: ProjectsViewProps) {
	// State for creating new project
	const [isCreating, setIsCreating] = useState(false);
	const [newProjectName, setNewProjectName] = useState('');

	const handleCreateSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (newProjectName.trim() && onCreateProject) {
			onCreateProject(newProjectName.trim());
			setIsCreating(false);
			setNewProjectName('');
		}
	};

	// Group projects by folder
	const rootProjects = projects.filter((p) => !p.folderId);
	const projectsByFolder = new Map<string, Project[]>();

	for (const project of projects) {
		if (project.folderId) {
			const existing = projectsByFolder.get(project.folderId) || [];
			existing.push(project);
			projectsByFolder.set(project.folderId, existing);
		}
	}

	return (
		<div className="projects-view">
			{/* Create new project button or input */}
			{onCreateProject && !isCreating ? (
				<button
					type="button"
					className="project-item project-item--create"
					onClick={() => setIsCreating(true)}
				>
					<FolderPlus size={16} className="project-item__icon" />
					<span className="project-item__name">New Project</span>
				</button>
			) : onCreateProject && isCreating ? (
				<form onSubmit={handleCreateSubmit} className="project-create-form">
					<input
						type="text"
						className="project-create-input"
						placeholder="Project Name..."
						value={newProjectName}
						onChange={(e) => setNewProjectName(e.target.value)}
						onBlur={() => !newProjectName && setIsCreating(false)}
					/>
					<button type="submit" className="hidden-submit" />
				</form>
			) : null}

			{/* Folders with their projects */}
			{folders.map((folder) => {
				const folderProjects = projectsByFolder.get(folder.id) || [];
				return (
					<div key={folder.id} className="folder-group">
						<div className="folder-header">
							<ChevronRight size={14} />
							<span>{folder.icon || '📁'}</span>
							<span className="folder-header__name">{folder.name}</span>
						</div>
						{folderProjects.map((project) => (
							<button
								key={project.id}
								type="button"
								className={`project-item project-item--nested ${
									selectedProjectId === project.id ? 'project-item--selected' : ''
								}`}
								onClick={() => onSelectProject(project.id)}
							>
								<Palette size={14} className="project-item__icon" />
								<span className="project-item__name">{project.name}</span>
							</button>
						))}
					</div>
				);
			})}

			{/* Root-level projects */}
			{rootProjects.map((project) => (
				<button
					key={project.id}
					type="button"
					className={`project-item ${
						selectedProjectId === project.id ? 'project-item--selected' : ''
					}`}
					onClick={() => onSelectProject(project.id)}
				>
					<Palette size={16} className="project-item__icon" />
					<span className="project-item__name">{project.name}</span>
				</button>
			))}

			{/* Empty state */}
			{projects.length === 0 && (
				<div className="projects-view__empty">
					<p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
						No projects yet
					</p>
				</div>
			)}
		</div>
	);
}
