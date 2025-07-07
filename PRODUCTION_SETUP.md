# PakeAja CRM - Production Setup Guide

This guide will help you deploy PakeAja CRM with Supabase backend for production use.

## 🚀 Quick Setup Overview

1. **Create Supabase Project**
2. **Run Database Migrations**
3. **Configure Environment Variables**
4. **Enable Supabase Services**
5. **Deploy Application**
6. **Create Initial Users**

---

## 📋 Prerequisites

- [Supabase Account](https://supabase.com)
- [Vercel Account](https://vercel.com) (for deployment)
- Node.js 18+ installed locally

---

## 1. Create Supabase Project

### Step 1.1: Create New Project
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose organization and fill details:
   - **Name**: `pakeaja-crm-production`
   - **Database Password**: Use a strong password (save this!)
   - **Region**: Choose closest to your users (Asia Southeast for Indonesia)

### Step 1.2: Get Project Credentials
After project creation, go to **Settings > API** and copy:
- **Project URL**
- **anon public key**
- **service_role secret key**

---

## 2. Run Database Migrations

### Step 2.1: Enable SQL Editor
1. In Supabase Dashboard, go to **SQL Editor**
2. Create a new query

### Step 2.2: Run Schema Migration
```sql
-- Copy and paste the contents of:
-- supabase/migrations/20240107_complete_schema.sql
```

### Step 2.3: Run RLS Policies
```sql
-- Copy and paste the contents of:
-- supabase/migrations/20240107_rls_policies.sql
```

### Step 2.4: Create Storage Bucket
1. Go to **Storage** in Supabase
2. Create new bucket: `canvassing-photos`
3. Set as **Public bucket** ✅
4. Click **Save**

### Step 2.5: Set Storage Policies
In SQL Editor, run:
```sql
-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'canvassing-photos' AND auth.uid() IS NOT NULL);

-- Allow authenticated users to view files
CREATE POLICY "Authenticated users can view photos" ON storage.objects
FOR SELECT USING (bucket_id = 'canvassing-photos' AND auth.uid() IS NOT NULL);
```

---

## 3. Configure Environment Variables

### Step 3.1: Update Local Environment
Copy `.env.example` to `.env.local` and update:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Service Configuration
NEXT_PUBLIC_USE_SUPABASE=true  # 🔥 IMPORTANT: Enable Supabase services

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME="PakeAja CRM"
```

### Step 3.2: Configure for Deployment
For Vercel deployment, add these environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_USE_SUPABASE=true`

---

## 4. Test Local Setup

### Step 4.1: Install Dependencies
```bash
npm install
```

### Step 4.2: Start Development Server
```bash
npm run dev
```

### Step 4.3: Verify Supabase Connection
1. Go to `http://localhost:3001`
2. Check browser console for any connection errors
3. Try creating a test user

---

## 5. Deploy to Production

### Step 5.1: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Step 5.2: Configure Domain (Optional)
1. In Vercel dashboard, go to your project
2. Settings > Domains
3. Add your custom domain

---

## 6. Create Initial Users

### Step 6.1: Create Admin User
1. Go to your deployed app
2. Register first user with admin role
3. Or manually insert in Supabase:

```sql
-- Insert admin user (replace with actual auth user ID)
INSERT INTO public.users (id, full_name, role, is_active)
VALUES ('auth-user-uuid', 'Admin User', 'admin', true);
```

### Step 6.2: Create Sales Team Users
Use the registration form to create users with appropriate roles:
- **Sales Manager**: Can see all leads and reports
- **Sales Rep**: Can see assigned leads and create reports
- **Field Sales**: Focused on canvassing

---

## 🔧 Advanced Configuration

### Email Configuration (Optional)
For password reset and notifications:
1. In Supabase Dashboard > Authentication > Settings
2. Configure SMTP settings or use Supabase's email service

### Row Level Security Verification
Test that users can only see their own data:
1. Create test users with different roles
2. Verify data isolation works correctly

### File Upload Limits
In Supabase Storage settings, configure:
- **Max file size**: 10MB (for photos)
- **Allowed file types**: image/*

---

## 📊 Post-Deployment Checklist

- [ ] ✅ Database schema created
- [ ] ✅ RLS policies active
- [ ] ✅ Storage bucket configured
- [ ] ✅ Environment variables set
- [ ] ✅ Supabase services enabled
- [ ] ✅ Application deployed
- [ ] ✅ Admin user created
- [ ] ✅ Test canvassing workflow
- [ ] ✅ Test sales pipeline workflow
- [ ] ✅ Data isolation verified

---

## 🆘 Troubleshooting

### Common Issues

**1. "Failed to fetch" errors**
- Check CORS settings in Supabase
- Verify environment variables
- Check network connectivity

**2. Authentication not working**
- Verify Supabase URL and keys
- Check RLS policies are enabled
- Ensure user exists in `users` table

**3. File uploads failing**
- Check storage bucket permissions
- Verify storage policies
- Check file size limits

**4. Data not showing**
- Verify RLS policies
- Check user permissions
- Confirm data exists in database

### Getting Help

1. Check browser console for errors
2. Review Supabase logs in dashboard
3. Verify database connection in SQL editor

---

## 🔄 Switching Between Mock and Supabase

### Development (Mock Services)
```bash
# .env.local
NEXT_PUBLIC_USE_SUPABASE=false
```

### Production (Supabase Services)
```bash
# .env.local or Vercel environment
NEXT_PUBLIC_USE_SUPABASE=true
```

This allows you to develop with mock data locally and use real database in production.

---

## 📈 Monitoring and Maintenance

### Database Monitoring
- Monitor Supabase usage in dashboard
- Set up alerts for high usage
- Regular database backups

### Performance Optimization
- Monitor API response times
- Optimize slow queries
- Scale Supabase tier as needed

### Security Best Practices
- Regularly review RLS policies
- Monitor authentication logs
- Keep Supabase updated

---

🎉 **Congratulations!** Your PakeAja CRM is now ready for production use with full Supabase backend integration.