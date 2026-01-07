-- Row Level Security (RLS) Policies
-- Migration: 002_rls_policies.sql
-- Secures all tables so users can only access their own data

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE reference_images ENABLE ROW LEVEL SECURITY;

-- ============================================
-- WORKSPACES POLICIES
-- ============================================
-- Users can only see their own workspace
CREATE POLICY "Users can view own workspace"
  ON workspaces FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own workspace
CREATE POLICY "Users can update own workspace"
  ON workspaces FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- FOLDERS POLICIES
-- ============================================
-- Users can view folders in their workspace
CREATE POLICY "Users can view own folders"
  ON folders FOR SELECT
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

-- Users can insert folders in their workspace
CREATE POLICY "Users can create folders"
  ON folders FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

-- Users can update their own folders
CREATE POLICY "Users can update own folders"
  ON folders FOR UPDATE
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

-- Users can delete their own folders
CREATE POLICY "Users can delete own folders"
  ON folders FOR DELETE
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- PROJECTS POLICIES
-- ============================================
-- Users can view projects in their workspace
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

-- Users can insert projects in their workspace
CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

-- Users can update their own projects
CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

-- Users can delete their own projects
CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- COLORS POLICIES
-- ============================================
-- Users can view colors in their projects
CREATE POLICY "Users can view own colors"
  ON colors FOR SELECT
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      WHERE w.user_id = auth.uid()
    )
  );

-- Users can insert colors in their projects
CREATE POLICY "Users can create colors"
  ON colors FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      WHERE w.user_id = auth.uid()
    )
  );

-- Users can update their own colors
CREATE POLICY "Users can update own colors"
  ON colors FOR UPDATE
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      WHERE w.user_id = auth.uid()
    )
  );

-- Users can delete their own colors
CREATE POLICY "Users can delete own colors"
  ON colors FOR DELETE
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      WHERE w.user_id = auth.uid()
    )
  );

-- ============================================
-- REFERENCE IMAGES POLICIES
-- ============================================
-- Users can view reference images in their projects
CREATE POLICY "Users can view own reference images"
  ON reference_images FOR SELECT
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      WHERE w.user_id = auth.uid()
    )
  );

-- Users can insert reference images in their projects
CREATE POLICY "Users can create reference images"
  ON reference_images FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      WHERE w.user_id = auth.uid()
    )
  );

-- Users can delete their own reference images
CREATE POLICY "Users can delete own reference images"
  ON reference_images FOR DELETE
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN workspaces w ON p.workspace_id = w.id
      WHERE w.user_id = auth.uid()
    )
  );
