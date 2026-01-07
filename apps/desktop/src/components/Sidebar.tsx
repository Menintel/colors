// Sidebar component with folders and projects navigation

import type { Folder, Project } from '@colors/shared';
import { ChevronDown, ChevronRight, FolderClosed, FolderOpen, LogOut, Palette, Plus, Settings } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore, useUIStore, useWorkspaceStore } from '../stores';
import './Sidebar.css';

export function Sidebar() {
	const { sidebarOpen, openNewFolderModal, openNewProjectModal } = useUIStore();
	const { signOut, user } = useAuthStore();
	const { folders, projects, selectedFolderId, selectedProjectId, selectFolder, selectProject } = useWorkspaceStore();

	const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

	if (!sidebarOpen) return null;

	const toggleFolder = (folderId: string) => {
		setExpandedFolders((prev) => {
			const next = new Set(prev);
			if (next.has(folderId)) {
				next.delete(folderId);
			} else {
				next.add(folderId);
			}
			return next;
		});
	};

	// Get root folders
	const rootFolders = folders.filter((f) => !f.parentId);

	// Get projects not in any folder
	const rootProjects = projects.filter((p) => !p.folderId);

	// Get projects for a specific folder
	const getProjectsInFolder = (folderId: string) => projects.filter((p) => p.folderId === folderId);

	// Get child folders
	const getChildFolders = (parentId: string) => folders.filter((f) => f.parentId === parentId);

	const renderFolder = (folder: Folder, depth = 0) => {
		const isExpanded = expandedFolders.has(folder.id);
		const isSelected = selectedFolderId === folder.id;
		const childFolders = getChildFolders(folder.id);
		const folderProjects = getProjectsInFolder(folder.id);
		const hasChildren = childFolders.length > 0 || folderProjects.length > 0;

		return (
			<div key={folder.id} className="folder-item">
				<button
					type="button"
					className={`folder-row ${isSelected ? 'selected' : ''}`}
					style={{ paddingLeft: `${12 + depth * 16}px` }}
					onClick={() => {
						selectFolder(folder.id);
						if (hasChildren) toggleFolder(folder.id);
					}}
				>
					<span className="folder-chevron">{hasChildren && (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}</span>
					{isExpanded ? <FolderOpen size={16} className="folder-icon" /> : <FolderClosed size={16} className="folder-icon" />}
					<span className="folder-name">{folder.name}</span>
				</button>

				{isExpanded && (
					<div className="folder-children">
						{childFolders.map((child) => renderFolder(child, depth + 1))}
						{folderProjects.map((project) => renderProject(project, depth + 1))}
					</div>
				)}
			</div>
		);
	};

	const renderProject = (project: Project, depth = 0) => {
		const isSelected = selectedProjectId === project.id;

		return (
			<button
				key={project.id}
				type="button"
				className={`project-row ${isSelected ? 'selected' : ''}`}
				style={{ paddingLeft: `${12 + depth * 16 + 20}px` }}
				onClick={() => selectProject(project.id)}
			>
				<Palette size={16} className="project-icon" />
				<span className="project-name">{project.name}</span>
			</button>
		);
	};

	return (
		<aside className="sidebar">
			<div className="sidebar-header">
				<div className="app-logo">
					<Palette size={24} />
					<span>Colors</span>
				</div>
			</div>

			<div className="sidebar-content">
				<div className="sidebar-section">
					<div className="section-header">
						<span>Projects</span>
						<div className="section-actions">
							<button type="button" className="icon-button" onClick={openNewFolderModal} title="New folder">
								<FolderClosed size={14} />
								<Plus size={10} className="plus-badge" />
							</button>
							<button type="button" className="icon-button" onClick={openNewProjectModal} title="New project">
								<Palette size={14} />
								<Plus size={10} className="plus-badge" />
							</button>
						</div>
					</div>

					<div className="folder-tree">
						{rootFolders.map((folder) => renderFolder(folder))}
						{rootProjects.map((project) => renderProject(project))}

						{folders.length === 0 && projects.length === 0 && (
							<div className="empty-state">
								<p>No projects yet</p>
								<button type="button" className="create-btn" onClick={openNewProjectModal}>
									Create your first project
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="sidebar-footer">
				<div className="user-info">
					<div className="user-avatar">{user?.email?.charAt(0).toUpperCase()}</div>
					<span className="user-email">{user?.email}</span>
				</div>
				<div className="footer-actions">
					<button type="button" className="icon-button" title="Settings">
						<Settings size={18} />
					</button>
					<button type="button" className="icon-button" onClick={signOut} title="Sign out">
						<LogOut size={18} />
					</button>
				</div>
			</div>
		</aside>
	);
}
