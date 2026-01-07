-- ==========================================================
-- COLORS DATABASE - COMPLETE SETUP
-- ==========================================================
-- Run this entire script in the Supabase SQL Editor
-- Dashboard: https://supabase.com/dashboard/project/csbkrotclheolwpnfnbx/sql
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. TABLES
-- ============================================

-- Workspaces (one per user)
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Workspace',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_workspace UNIQUE (user_id)
);

-- Folders (hierarchical organization)
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Projects (color collections)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Colors
CREATE TABLE colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  hex TEXT NOT NULL,
  rgb JSONB,
  hsl JSONB,
  name TEXT,
  notes TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('picker', 'image', 'manual')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reference Images
CREATE TABLE reference_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  filename TEXT NOT NULL,
  extracted_colors UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 2. INDEXES
-- ============================================
CREATE INDEX idx_folders_workspace ON folders(workspace_id);
CREATE INDEX idx_folders_parent ON folders(parent_id);
CREATE INDEX idx_projects_workspace ON projects(workspace_id);
CREATE INDEX idx_projects_folder ON projects(folder_id);
CREATE INDEX idx_colors_project ON colors(project_id);
CREATE INDEX idx_reference_images_project ON reference_images(project_id);

-- ============================================
-- 3. TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_folders_updated_at
  BEFORE UPDATE ON folders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_colors_updated_at
  BEFORE UPDATE ON colors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create workspace on user signup
CREATE OR REPLACE FUNCTION create_workspace_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO workspaces (user_id, name)
  VALUES (NEW.id, 'My Workspace');
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_workspace_for_new_user();

-- ============================================
-- 4. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE reference_images ENABLE ROW LEVEL SECURITY;

-- Workspaces
CREATE POLICY "Users can view own workspace" ON workspaces FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own workspace" ON workspaces FOR UPDATE USING (auth.uid() = user_id);

-- Folders
CREATE POLICY "Users can view own folders" ON folders FOR SELECT
  USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));
CREATE POLICY "Users can create folders" ON folders FOR INSERT
  WITH CHECK (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own folders" ON folders FOR UPDATE
  USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own folders" ON folders FOR DELETE
  USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));

-- Projects
CREATE POLICY "Users can view own projects" ON projects FOR SELECT
  USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));
CREATE POLICY "Users can create projects" ON projects FOR INSERT
  WITH CHECK (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE
  USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE
  USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));

-- Colors
CREATE POLICY "Users can view own colors" ON colors FOR SELECT
  USING (project_id IN (SELECT p.id FROM projects p JOIN workspaces w ON p.workspace_id = w.id WHERE w.user_id = auth.uid()));
CREATE POLICY "Users can create colors" ON colors FOR INSERT
  WITH CHECK (project_id IN (SELECT p.id FROM projects p JOIN workspaces w ON p.workspace_id = w.id WHERE w.user_id = auth.uid()));
CREATE POLICY "Users can update own colors" ON colors FOR UPDATE
  USING (project_id IN (SELECT p.id FROM projects p JOIN workspaces w ON p.workspace_id = w.id WHERE w.user_id = auth.uid()));
CREATE POLICY "Users can delete own colors" ON colors FOR DELETE
  USING (project_id IN (SELECT p.id FROM projects p JOIN workspaces w ON p.workspace_id = w.id WHERE w.user_id = auth.uid()));

-- Reference Images
CREATE POLICY "Users can view own images" ON reference_images FOR SELECT
  USING (project_id IN (SELECT p.id FROM projects p JOIN workspaces w ON p.workspace_id = w.id WHERE w.user_id = auth.uid()));
CREATE POLICY "Users can create images" ON reference_images FOR INSERT
  WITH CHECK (project_id IN (SELECT p.id FROM projects p JOIN workspaces w ON p.workspace_id = w.id WHERE w.user_id = auth.uid()));
CREATE POLICY "Users can delete own images" ON reference_images FOR DELETE
  USING (project_id IN (SELECT p.id FROM projects p JOIN workspaces w ON p.workspace_id = w.id WHERE w.user_id = auth.uid()));

-- ============================================
-- 5. STORAGE BUCKET
-- ============================================
-- NOTE: Run this separately if the bucket already exists

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'reference-images',
  'reference-images',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload own images" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'reference-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view own storage images" ON storage.objects FOR SELECT
  USING (bucket_id = 'reference-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own storage images" ON storage.objects FOR DELETE
  USING (bucket_id = 'reference-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- DONE! Your database is ready.
-- ============================================
