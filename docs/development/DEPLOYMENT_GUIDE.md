# 🚀 Deployment Guide for PakeAja CRM

## Environment Variables Setup

### Required Variables

Your application needs these environment variables to function properly:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Vercel Deployment

### Step 1: Set Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `pakeaja-crm` project
3. Go to **Settings** → **Environment Variables**
4. Add these variables for **ALL environments** (Production, Preview, Development):

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://bemrgpgwaatizgxftzgg.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY  
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlbXJncGd3YWF0aXpneGZ0emdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MDQwNDQsImV4cCI6MjA2NzM4MDA0NH0.hou5EsWIq2HkRyI2qEWjfT_3TfArInOd4yhdBPTSIsA
Environments: ✅ Production ✅ Preview ✅ Development
```

### Step 2: Trigger Deployment

After setting the environment variables:

1. Go to **Deployments** tab in Vercel
2. Click **Redeploy** on the latest deployment, OR
3. Push a new commit to trigger automatic deployment

## Local Development

### Step 1: Create Local Environment File

```bash
cp .env.example .env.local
```

### Step 2: Fill in Values

Edit `.env.local` with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://bemrgpgwaatizgxftzgg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_NAME=PakeAja CRM
NEXT_PUBLIC_USE_SUPABASE=true
```

### Step 3: Start Development Server

```bash
npm run dev
```

## Troubleshooting

### Build Failing with Environment Variable Errors

If you see errors like:
```
❌ Missing required: NEXT_PUBLIC_SUPABASE_URL
❌ Missing required: NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Solution:**
1. Verify environment variables are set in Vercel dashboard
2. Ensure variables are added to ALL environments (Production, Preview, Development)
3. Check variable names are exactly correct (case-sensitive)
4. Redeploy after adding variables

### Enhanced Logging

The build script now includes comprehensive logging to help diagnose issues:
- Environment detection (Vercel vs Local)
- Available environment variables
- Missing variables with clear instructions

### Alternative Build Commands

If environment validation is blocking your build:

```bash
# Skip environment validation (for testing)
npm run build:no-check

# Vercel-specific build (with enhanced logging)
npm run build:vercel
```

## Security Notes

- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe for client-side use
- ✅ It respects Row Level Security (RLS) policies
- ❌ Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- ❌ Service role key bypasses all security policies

## Support

If you continue having deployment issues:

1. Check the build logs in Vercel for detailed error information
2. Verify all environment variables are correctly set
3. Ensure your Supabase project is accessible
4. Contact support with specific error messages from the logs 