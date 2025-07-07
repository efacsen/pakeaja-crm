# Environment Variables Setup Guide

> Last updated: January 7, 2025

## Required Environment Variables

The following environment variables MUST be set for the application to build and run:

### Supabase Configuration
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Setup Instructions

### Local Development

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Get your Supabase credentials:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Go to Settings → API
   - Copy the Project URL and anon key

3. Update `.env.local` with your values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### GitHub Actions Setup

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add the following repository secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Vercel Deployment Setup

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add the same environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Make sure to add them for all environments (Production, Preview, Development)

## Verification

Run the environment check script:
```bash
node scripts/check-env.js
```

This will verify all required environment variables are set correctly.

## Troubleshooting

### Build Fails with "Your project's URL and API key are required"
- Ensure environment variables are set in your deployment platform
- For GitHub Actions, check that secrets are properly configured
- For Vercel, ensure variables are added for the correct environment

### Environment Variables Not Loading
- Restart your development server after changing `.env.local`
- Ensure variable names start with `NEXT_PUBLIC_` for client-side access
- Check for typos in variable names

### Different Environments
- Use `.env.local` for local development (git ignored)
- Use `.env.development` for development-specific settings
- Use `.env.production` for production-specific settings
- Never commit sensitive values to version control