-- Storage Bucket Configuration
-- Migration: 003_storage.sql
-- Creates storage bucket for reference images

-- Create the reference-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'reference-images',
  'reference-images',
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Users can upload images to their own folder (user_id/filename)
CREATE POLICY "Users can upload own images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'reference-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can view their own images
CREATE POLICY "Users can view own images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'reference-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own images
CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'reference-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
