-- SQL script to set up test user roles
-- Run this in Supabase SQL Editor after creating the users

-- First, let's check if the users exist
SELECT id, email FROM auth.users WHERE email IN ('admin@test.com', 'manager@test.com', 'sales@test.com');

-- Update or insert profiles for test users
-- Admin user
INSERT INTO public.profiles (id, email, full_name, role, is_active, created_at, updated_at)
SELECT 
    id,
    email,
    'Admin User',
    'admin',
    true,
    NOW(),
    NOW()
FROM auth.users 
WHERE email = 'admin@test.com'
ON CONFLICT (id) 
DO UPDATE SET 
    role = 'admin',
    full_name = 'Admin User',
    updated_at = NOW();

-- Manager user
INSERT INTO public.profiles (id, email, full_name, role, is_active, created_at, updated_at)
SELECT 
    id,
    email,
    'Manager User',
    'manager',
    true,
    NOW(),
    NOW()
FROM auth.users 
WHERE email = 'manager@test.com'
ON CONFLICT (id) 
DO UPDATE SET 
    role = 'manager',
    full_name = 'Manager User',
    updated_at = NOW();

-- Sales user
INSERT INTO public.profiles (id, email, full_name, role, is_active, created_at, updated_at)
SELECT 
    id,
    email,
    'Sales User',
    'sales',
    true,
    NOW(),
    NOW()
FROM auth.users 
WHERE email = 'sales@test.com'
ON CONFLICT (id) 
DO UPDATE SET 
    role = 'sales',
    full_name = 'Sales User',
    updated_at = NOW();

-- Verify the profiles were created/updated
SELECT id, email, full_name, role, is_active 
FROM public.profiles 
WHERE email IN ('admin@test.com', 'manager@test.com', 'sales@test.com');