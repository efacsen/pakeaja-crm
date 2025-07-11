-- Create storage bucket for canvassing photos
-- Run this in your Supabase SQL Editor

-- First, ensure the storage schema exists
CREATE SCHEMA IF NOT EXISTS storage;

-- Create the canvassing-photos bucket
INSERT INTO storage.buckets (id, name, public, created_at, updated_at)
VALUES ('canvassing-photos', 'canvassing-photos', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the bucket

-- Policy: Allow authenticated users to upload photos
CREATE POLICY "Authenticated users can upload photos" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'canvassing-photos');

-- Policy: Allow authenticated users to view photos
CREATE POLICY "Authenticated users can view photos" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (bucket_id = 'canvassing-photos');

-- Policy: Allow authenticated users to update their own photos
CREATE POLICY "Users can update own photos" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'canvassing-photos' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'canvassing-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy: Allow authenticated users to delete their own photos
CREATE POLICY "Users can delete own photos" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'canvassing-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Verify the bucket was created
SELECT * FROM storage.buckets WHERE id = 'canvassing-photos';